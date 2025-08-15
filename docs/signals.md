# Signal Taxonomy

### Signal Types
- `early_cluster` — Wallets forming suspicious groups
- `stealth_spawn` — Contract created with zero metadata
- `anomaly_delta` — Repeating action across unrelated wallets

## Signal Format
Each signal includes:
- `type` — Signal classification
- `timestamp` — Detection time
- `source agent` — Originating agent
- `Hashed event ID` — Hashed event identifier