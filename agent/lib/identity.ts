import { byPrincipal } from "eve/memory/scope";
import type { MemoryScopeContext } from "eve/memory";

/**
 * Durable Blob identity for brief + next-action continuity.
 *
 * Key source: Eve `byPrincipal(ctx)` from `ctx.session.auth.current`.
 * That is Eve's durable caller identity — not the HTTP `sessionId`.
 *
 * `byPrincipal` returns:
 * - `"local-dev"` for Eve's synthetic local principal (`localDev()`)
 * - `JSON.stringify([principalType, authenticator, issuer, principalId])`
 *   for every other non-disabled principal (OIDC `external_sub` users, etc.)
 * - `null` for `anonymous` and `runtime` principals (Blob skipped)
 *
 * Limits:
 * - Local `eve dev` sessions share one `"local-dev"` key (process-local store).
 * - Production browsers still hit `placeholderAuth()` 401 until a real user
 *   AuthFn is added. OIDC TUI/deployment callers with a user principal persist.
 * - Runtime/service OIDC tokens do not get Blob continuity (Eve disables them).
 */
export function continuityIdentityKey(
  ctx: Pick<MemoryScopeContext, "session"> &
    Partial<Pick<MemoryScopeContext, "abortSignal" | "channel">>,
): string | null {
  return byPrincipal({
    abortSignal: ctx.abortSignal ?? new AbortController().signal,
    channel: ctx.channel ?? {},
    session: ctx.session,
  });
}
