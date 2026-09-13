import { createHash } from "node:crypto";
import {
  MemoryDocumentConflictError,
  type MemoryDocumentBackend,
} from "eve/memory/file";
import { inMemory } from "eve/memory/file";
import { vercelBlob } from "eve/memory/file/vercel";
import { lockBrief } from "./brief";
import { continuityIdentityKey } from "./identity";
import { peatySession, type OnboardingBrief, type PeatySession } from "./session-state";

export const CONTINUITY_PREFIX = "peaty/continuity";
export const CONTINUITY_DOCUMENT_VERSION = 1 as const;

export type ContinuityRecord = {
  brief: OnboardingBrief;
  lastNextAction: string | null;
};

export type ContinuityDocument = {
  version: typeof CONTINUITY_DOCUMENT_VERSION;
  brief: {
    primaryGoal: string;
    markers: string[];
    hardConstraints: string[];
    doNotDo: string[];
    safetyGate: true;
  };
  lastNextAction: string | null;
};

export type ContinuityAuthCtx = Parameters<typeof continuityIdentityKey>[0] & {
  abortSignal?: AbortSignal;
};

export class ContinuityStoreNotConfiguredError extends Error {
  constructor() {
    super(
      [
        "Peaty Blob continuity is not configured.",
        "On Vercel, bind a private Blob store, then redeploy. Exact env (first match wins):",
        "1. EVE_MEMORY_BLOB_STORE_ID + Vercel OIDC (preferred; `eve integration setup file-memory`)",
        "2. EVE_MEMORY_BLOB_READ_WRITE_TOKEN",
        "3. BLOB_STORE_ID + Vercel OIDC",
        "4. BLOB_READ_WRITE_TOKEN",
        "No extra Nick-owned secret is required for the OIDC store-id path.",
      ].join(" "),
    );
    this.name = "ContinuityStoreNotConfiguredError";
  }
}

let testBackend: MemoryDocumentBackend | undefined;
let productionBackend: MemoryDocumentBackend | undefined;

/** Tests inject a fresh `inMemory()` so session A → session B share one store. */
export function setContinuityBackendForTests(
  backend: MemoryDocumentBackend | undefined,
): void {
  testBackend = backend;
}

export function continuityObjectKey(identityKey: string): string {
  return createHash("sha256")
    .update(`peaty.continuity.v1:${identityKey}`)
    .digest("hex");
}

export function serializeContinuity(record: ContinuityRecord): string {
  const document: ContinuityDocument = {
    version: CONTINUITY_DOCUMENT_VERSION,
    brief: {
      primaryGoal: record.brief.primaryGoal,
      markers: record.brief.markers,
      hardConstraints: record.brief.hardConstraints,
      doNotDo: record.brief.doNotDo,
      safetyGate: true,
    },
    lastNextAction: record.lastNextAction,
  };
  return `${JSON.stringify(document)}\n`;
}

export function parseContinuity(content: string): ContinuityRecord {
  const parsed: unknown = JSON.parse(content);
  if (!isContinuityDocument(parsed)) {
    throw new TypeError("Blob continuity document is not a Peaty brief record.");
  }

  const brief = lockBrief({
    primaryGoal: parsed.brief.primaryGoal,
    markers: parsed.brief.markers,
    hardConstraints: parsed.brief.hardConstraints,
    doNotDo: parsed.brief.doNotDo,
  });

  const lastNextAction =
    parsed.lastNextAction === null ? null : parsed.lastNextAction.trim();

  return {
    brief,
    lastNextAction: lastNextAction && lastNextAction.length > 0 ? lastNextAction : null,
  };
}

export function getContinuityBackend(): MemoryDocumentBackend {
  if (testBackend !== undefined) {
    return testBackend;
  }
  productionBackend ??= createProductionBackend();
  return productionBackend;
}

export async function loadContinuity(args: {
  backend: MemoryDocumentBackend;
  identityKey: string;
  signal: AbortSignal;
}): Promise<ContinuityRecord | null> {
  const document = await args.backend.read({
    key: continuityObjectKey(args.identityKey),
    signal: args.signal,
  });
  if (document === null) {
    return null;
  }
  return parseContinuity(document.content);
}

export async function saveContinuity(args: {
  backend: MemoryDocumentBackend;
  identityKey: string;
  record: ContinuityRecord;
  signal: AbortSignal;
}): Promise<void> {
  const key = continuityObjectKey(args.identityKey);
  const content = serializeContinuity(args.record);
  let current = await args.backend.read({ key, signal: args.signal });

  for (let attempt = 0; attempt < 8; attempt += 1) {
    try {
      await args.backend.write({
        key,
        content,
        expectedVersion: current?.version ?? null,
        signal: args.signal,
      });
      return;
    } catch (error) {
      if (!MemoryDocumentConflictError.is(error)) {
        throw error;
      }
      current = await args.backend.read({ key, signal: args.signal });
    }
  }

  throw new Error("Blob continuity write conflicted too many times.");
}

/**
 * On a brand-new HTTP session, pull the locked brief + last next action
 * from Blob so morning return can run without re-onboarding.
 */
export async function hydrateSessionContinuity(ctx: ContinuityAuthCtx): Promise<void> {
  const session = peatySession.get();
  if (session.brief !== null) {
    return;
  }

  const identityKey = continuityIdentityKey(ctx);
  if (identityKey === null) {
    return;
  }

  const record = await loadContinuity({
    backend: getContinuityBackend(),
    identityKey,
    signal: ctx.abortSignal ?? AbortSignal.timeout(10_000),
  });
  if (record === null) {
    return;
  }

  peatySession.update((current) => applyContinuityRecord(current, record));
}

export async function persistSessionContinuity(
  ctx: ContinuityAuthCtx,
): Promise<{ persisted: true; identityKey: string } | { persisted: false; reason: "no-principal" }> {
  const identityKey = continuityIdentityKey(ctx);
  if (identityKey === null) {
    return { persisted: false, reason: "no-principal" };
  }

  const { brief, lastNextAction } = peatySession.get();
  if (brief === null) {
    return { persisted: true, identityKey };
  }

  await saveContinuity({
    backend: getContinuityBackend(),
    identityKey,
    record: { brief, lastNextAction },
    signal: ctx.abortSignal ?? AbortSignal.timeout(10_000),
  });

  return { persisted: true, identityKey };
}

export function applyContinuityRecord(
  current: PeatySession,
  record: ContinuityRecord,
): PeatySession {
  return {
    ...current,
    brief: record.brief,
    lastNextAction: record.lastNextAction,
    continuityRestored: true,
    morningReturnIssued: false,
  };
}

function isContinuityDocument(value: unknown): value is ContinuityDocument {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const document = value as Partial<ContinuityDocument>;
  if (document.version !== CONTINUITY_DOCUMENT_VERSION) {
    return false;
  }
  if (typeof document.brief !== "object" || document.brief === null) {
    return false;
  }
  const brief = document.brief;
  if (typeof brief.primaryGoal !== "string" || brief.primaryGoal.trim().length === 0) {
    return false;
  }
  if (!isStringArray(brief.markers) || !isStringArray(brief.hardConstraints) || !isStringArray(brief.doNotDo)) {
    return false;
  }
  if (brief.safetyGate !== true) {
    return false;
  }
  if (document.lastNextAction !== null && typeof document.lastNextAction !== "string") {
    return false;
  }
  return true;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function createProductionBackend(): MemoryDocumentBackend {
  const blob = vercelBlobFromEnv();
  if (blob !== null) {
    return blob;
  }
  if (process.env.EVE_DEV === "1") {
    return inMemory();
  }
  if (process.env.VERCEL) {
    throw new ContinuityStoreNotConfiguredError();
  }
  throw new ContinuityStoreNotConfiguredError();
}

function vercelBlobFromEnv(): MemoryDocumentBackend | null {
  const eveStoreId = envValue("EVE_MEMORY_BLOB_STORE_ID");
  if (eveStoreId !== undefined) {
    return vercelBlob({ prefix: CONTINUITY_PREFIX, storeId: eveStoreId });
  }
  const eveToken = envValue("EVE_MEMORY_BLOB_READ_WRITE_TOKEN");
  if (eveToken !== undefined) {
    return vercelBlob({ prefix: CONTINUITY_PREFIX, token: eveToken });
  }
  const blobStoreId = envValue("BLOB_STORE_ID");
  if (blobStoreId !== undefined) {
    return vercelBlob({ prefix: CONTINUITY_PREFIX, storeId: blobStoreId });
  }
  const blobToken = envValue("BLOB_READ_WRITE_TOKEN");
  if (blobToken !== undefined) {
    return vercelBlob({ prefix: CONTINUITY_PREFIX, token: blobToken });
  }
  return null;
}

function envValue(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value === undefined || value.length === 0 ? undefined : value;
}
