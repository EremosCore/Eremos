# Events in Eremos

Events are the core unit of observation for Eremos agents.  
Each event represents a blockchain occurrence like a wallet transfer, mint, or contract call.

### Event Example

```ts
{
  type: "wallet_activity",
  address: "So1anaUser123",
  cluster: "cluster_04",
  timestamp: 1717201922
}
```

Agents consume these events through their observe() function and emit signals based on custom logic.
