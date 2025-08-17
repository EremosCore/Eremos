# Contributing to Eremos  

Eremos is a public good for Solana transparency — thanks for helping build the swarm!  
We welcome TypeScript devs, designers, and on-chain analysts to extend the framework.  

## How to Contribute  
1. **Fork & Branch** → `git checkout -b feat/my-agent`  
2. **Install Deps** → `npm install`  
3. **Develop** → build or modify an agent under `/agents`  
   - Use `/scripts/dev-agent.ts` to simulate events locally  
   - Ensure your Solana RPC is set in `.env.local`  
4. **Commit & PR** → keep commits clean, titles descriptive, and avoid bloat  

## Contribution Ideas  
- **Agents** → Extend `/agents` with new watchers  
- **Signal Logic** → Improve confidence scoring in `/utils`  
- **Docs** → Add/update diagrams, improve README or whitepaper  
- **Good First Issues** → Check labels like `good-first-issue` (e.g. add tests to `example.ts`)  
