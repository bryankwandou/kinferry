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
| Live chain activity endpoint | Confirmed program signatures returned | Pass |
| AI settlement confirmation | Groq confirmation generated from real signature data | Pass |
| Global wallet control | Connected address and live devnet balance displayed | Pass |
| Recipient wallet signature | Ed25519 signature verified against invited public key | Pass |
| Sender policy initialization | Owner-signed policy PDA created on devnet | Pass |
| Verified recipient activation | Owner-signed allowlist PDA created on devnet | Pass |
| Real guarded transfer | Recipient balance increased by exactly 1,000,000 lamports | Pass |
| On-chain over-cap attempt | Program rejected 11,000,000 lamports | Pass |
| On-chain unallowlisted attempt | Program rejected unknown recipient PDA | Pass |

Latest devnet transfer signature: `5z7cfzcCamdUvGAWMDPY42bGyTcDUMJdgr4ho5YYHJYo2fJUFsaUaUF9vdBf6XFnQ5ikku4ak17cEEbFTKCAA3Zp`.

The browser now submits the real deployed Anchor instruction through the connected wallet. The current proof asset is devnet SOL; audited stablecoin-token settlement remains a pre-mainnet integration task.
