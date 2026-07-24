# Kinferry

Kinferry is a Solana devnet remittance-agent MVP built around one rule: an agent may prepare a transfer, but it cannot decide who is trusted or exceed the sender's authority.

## What works

- Interactive landing page and sender workspace
- Recipient-owned, single-use verification endpoint
- Natural-language transfer drafting with optional Groq parsing
- Server-signed FX quote locks that reject forged expiry or amount changes
- Nonce and content-fingerprint duplicate protection
- Signed, expiring, single-use recipient verification links
- Recurring transfers routed through the same guard chain
- Anchor program for owner-only allowlisting and on-chain spending caps
- Live Solana devnet proof page with RPC fallback
- Immutable-history UX, responsive layouts, and reduced-motion support

## Routes

`/`, `/dashboard`, `/recipients`, `/recipients/new`, `/transfer/new`, `/recurring`, `/history`, `/proof`, and `/verify/[token]`.

## Local development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local`. The Groq key is optional; deterministic parsing remains available without it.

## Validation

```bash
npm run lint
npm run build
anchor build
```

Devnet program: `HZiw1u9BoKkdhppnN22HJzXUQJDca2yMeDY8wqywSdEs`

Deployment signature: `56SvRjDR3aPUzEvv1tjbKXRZhheJNw1mWVgfjLQCZ3wgENwQRdcwB2w1URXmKGQuVtkyLDreyFChhbQHVfWQxhfg`

## Important scope boundary

This is a developer demonstration on Solana devnet. It does not provide fiat on/off ramps, KYC/AML, sanctions screening, money-transmitter licensing, custody, or mainnet readiness. Production use requires regulated partners, legal review, operational controls, and an independent smart-contract audit.
