# Validation record

Validated on Friday, July 24, 2026.

| Workflow | Expected | Result |
|---|---|---|
| Production Next.js build | 16 routes compile and prerender | Pass |
| Verified recipient transfer | Settles after all checks | Pass |
| Unverified recipient | Hard block before signing | Pass |
| Per-transfer amount above $500 | Policy hard block | Pass |
| Expired FX quote | Quote hard block | Pass |
| Forged FX quote token | Signature hard block | Pass |
| Amount changed after quote | Signed-amount hard block | Pass |
| Reused request nonce | Duplicate hard block | Pass |
| Same transfer with a different nonce | Content-fingerprint hard block | Pass |
| Used verification token | Second confirmation rejected | Pass |
| Unsigned verification token | Rejected | Pass |
| Recurring tick without cron secret | Unauthorized | Pass |
| Recurring tick with cron secret | Shared guard chain executes | Pass |
| Clear natural-language instruction | Structured draft returned | Pass |
| Ambiguous instruction | Clarification requested | Pass |
| Anchor program build | SBF binary and IDL generated | Pass |
| Solana devnet deployment | Program confirmed on-chain | Pass |
| Live chain proof endpoint | Deployed program account returned | Pass |

The web settlement reference is a development receipt. Real token settlement wiring remains a pre-mainnet integration task; the deployed Anchor program currently proves owner-only allowlisting, cap enforcement, rolling spend, and guarded devnet lamport movement.
