# Signal Throttling

Some agents may attempt to emit signals too frequently.

The `utils/throttle.ts` helper ensures cooldown logic applies per agent.
This avoids signal spam during high-volume event windows.
