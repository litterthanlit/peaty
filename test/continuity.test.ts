import assert from "node:assert/strict";
import { test } from "node:test";
import { inMemory } from "eve/memory/file";
import { lockBrief } from "../agent/lib/brief";
import {
  applyContinuityRecord,
  ContinuityStoreNotConfiguredError,
  continuityObjectKey,
  loadContinuity,
  parseContinuity,
  saveContinuity,
  serializeContinuity,
  setContinuityBackendForTests,
} from "../agent/lib/continuity";
import { continuityIdentityKey } from "../agent/lib/identity";
import type { PeatySession } from "../agent/lib/session-state";
import { buildTurnLock } from "../agent/lib/turn-lock";

const SIGNAL = AbortSignal.timeout(5_000);

function emptySession(): PeatySession {
  return {
    brief: null,
    metrics: [],
    lastNextAction: null,
    inboundSafety: null,
    continuityRestored: false,
    morningReturnIssued: false,
  };
}

function principal(args: {
  principalType: string;
  authenticator: string;
  principalId: string;
  issuer?: string;
}) {
  return {
    attributes: {},
    authenticator: args.authenticator,
    issuer: args.issuer,
    principalId: args.principalId,
    principalType: args.principalType,
  };
}

function scope(current: ReturnType<typeof principal> | null) {
  return {
    abortSignal: new AbortController().signal,
    channel: {},
    session: {
      id: "http-session-new",
      auth: { current, initiator: current },
    },
  };
}

test("identity key is Eve byPrincipal from auth.current, not the HTTP session id", () => {
  const user = continuityIdentityKey(
    scope(
      principal({
        principalType: "user",
        authenticator: "vercel-oidc",
        issuer: "https://oidc.vercel.com",
        principalId: "external_sub_nick",
      }),
    ),
  );
  assert.equal(
    user,
    JSON.stringify(["user", "vercel-oidc", "https://oidc.vercel.com", "external_sub_nick"]),
  );

  const local = continuityIdentityKey(
    scope(
      principal({
        principalType: "local-dev",
        authenticator: "local-dev",
        principalId: "local-dev",
      }),
    ),
  );
  assert.equal(local, "local-dev");

  assert.equal(
    continuityIdentityKey(
      scope(
        principal({
          principalType: "anonymous",
          authenticator: "none",
          principalId: "anon",
        }),
      ),
    ),
    null,
  );
  assert.equal(
    continuityIdentityKey(
      scope(
        principal({
          principalType: "runtime",
          authenticator: "vercel-oidc",
          principalId: "eve:app",
        }),
      ),
    ),
    null,
  );
});

test("Blob write then a NEW empty session restores brief + morning return", async () => {
  const backend = inMemory();
  setContinuityBackendForTests(backend);
  try {
    const identityKey = continuityIdentityKey(
      scope(
        principal({
          principalType: "user",
          authenticator: "vercel-oidc",
          issuer: "https://oidc.vercel.com",
          principalId: "external_sub_nick",
        }),
      ),
    );
    assert.ok(identityKey);

    const brief = lockBrief({
      primaryGoal: "warmer mornings",
      markers: ["waking temp"],
      hardConstraints: ["dairy allergy"],
      doNotDo: ["fasting"],
    });

    await saveContinuity({
      backend,
      identityKey,
      record: { brief, lastNextAction: "salted milk and a walk" },
      signal: SIGNAL,
    });

    // Brand-new HTTP session: empty defineState, different session id, same principal.
    const loaded = await loadContinuity({ backend, identityKey, signal: SIGNAL });
    assert.ok(loaded);
    assert.equal(loaded.brief.safetyGate, true);
    assert.match(loaded.brief.screen, /Safety-gate: ON/);
    assert.equal(loaded.lastNextAction, "salted milk and a walk");

    const sessionB = applyContinuityRecord(emptySession(), loaded);
    assert.equal(sessionB.continuityRestored, true);
    assert.equal(sessionB.morningReturnIssued, false);

    const lock = buildTurnLock({
      inboundText: "opening a brand-new session, what next?",
      brief: sessionB.brief,
      lastNextAction: sessionB.lastNextAction,
      metricCount: 0,
      continuityRestored: sessionB.continuityRestored,
      morningReturnIssued: sessionB.morningReturnIssued,
    });
    assert.equal(lock.kind, "morning-return");
    assert.match(lock.content, /MORNING RETURN LOOP/);
    assert.match(lock.content, /Do not re-run onboarding/);
    assert.match(lock.content, /Loaded locked brief \+ last next action from Blob/);
    assert.match(lock.content, /Goal: warmer mornings/);
    assert.match(lock.content, /Last committed next action: salted milk and a walk/);
    assert.match(lock.content, /Safety-gate: ON/);

    const otherUser = await loadContinuity({
      backend,
      identityKey: JSON.stringify(["user", "vercel-oidc", "https://oidc.vercel.com", "someone-else"]),
      signal: SIGNAL,
    });
    assert.equal(otherUser, null);
  } finally {
    setContinuityBackendForTests(undefined);
  }
});

test("blob pathname is a hash of the Eve identity key, not the raw principal id", () => {
  const identityKey = JSON.stringify(["user", "vercel-oidc", null, "external_sub_nick"]);
  const objectKey = continuityObjectKey(identityKey);
  assert.match(objectKey, /^[a-f0-9]{64}$/);
  assert.equal(objectKey.includes("external_sub_nick"), false);
});

test("blob records with safetyGate not true are rejected", () => {
  assert.throws(() =>
    parseContinuity(
      JSON.stringify({
        version: 1,
        brief: {
          primaryGoal: "energy",
          markers: [],
          hardConstraints: [],
          doNotDo: [],
          safetyGate: false,
        },
        lastNextAction: "orange juice",
      }),
    ),
  );
});

test("a valid blob document re-locks the canonical screen with Safety-gate ON", () => {
  const parsed = parseContinuity(
    serializeContinuity({
      brief: lockBrief({
        primaryGoal: "energy",
        markers: [],
        hardConstraints: [],
        doNotDo: [],
      }),
      lastNextAction: "orange juice",
    }),
  );
  assert.equal(parsed.brief.safetyGate, true);
  assert.match(parsed.brief.screen, /Safety-gate: ON/);
  assert.equal(parsed.lastNextAction, "orange juice");
});

test("after the restored morning return, later turns continue instead of re-onboarding", () => {
  const brief = lockBrief({
    primaryGoal: "steadier energy",
    markers: [],
    hardConstraints: [],
    doNotDo: [],
  });
  const lock = buildTurnLock({
    inboundText: "check this lunch",
    brief,
    lastNextAction: "salt the eggs",
    metricCount: 0,
    continuityRestored: true,
    morningReturnIssued: true,
  });
  assert.equal(lock.kind, "continue");
  assert.doesNotMatch(lock.content, /ONBOARDING LOCK/);
});

test("missing Blob bindings fail with the exact env list", () => {
  const error = new ContinuityStoreNotConfiguredError();
  assert.match(error.message, /EVE_MEMORY_BLOB_STORE_ID/);
  assert.match(error.message, /EVE_MEMORY_BLOB_READ_WRITE_TOKEN/);
  assert.match(error.message, /BLOB_STORE_ID/);
  assert.match(error.message, /BLOB_READ_WRITE_TOKEN/);
  assert.match(error.message, /eve integration setup file-memory/);
});
