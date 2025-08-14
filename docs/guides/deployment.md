# Deployment

This guide covers local usage, containerization, serverless patterns, and output sinks.

## Environment

Create a `.env` or export variables as needed:

- `SOLANA_RPC_URL` — endpoint for chain data
- `SOLANA_WEBSOCKET_URL` — optional websocket for subscriptions
- `DISCORD_WEBHOOK_URL` — optional sink for signals
- `WEBHOOK_URL` — optional generic sink
- `LOG_LEVEL` — `info` (default) | `debug`
- `NETWORK` — `mainnet` (default) | `devnet`

## Local (quick)

```bash
npm install
npx tsx scripts/dev-agent.ts
```

## Docker (example)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
ENV NODE_ENV=production
CMD ["node", "scripts/generate-signal.js"]
```

Build & run:
```bash
docker build -t eremos:latest .
docker run --rm -e SOLANA_RPC_URL=$SOLANA_RPC_URL eremos:latest
```

## Serverless (pattern)

- Bundle `/agents` with `esbuild` or your preferred bundler.
- Deploy a single function per agent or a shared router receiving events.
- Forward signals to `DISCORD_WEBHOOK_URL` or `WEBHOOK_URL`.

## Sinks

- Console (default)
- Discord (via webhook)
- Generic webhooks

## Verification checklist

- [ ] Environment variables set
- [ ] Agent(s) registered and reachable
- [ ] Signals emitted and received by sink(s)
- [ ] Throttling behaves as expected under load
