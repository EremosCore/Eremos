# 🎭 Agent Glyphs

<div align="center">

**Visual identity system for Eremos agent identification**

[![Glyphs](https://img.shields.io/badge/Visual-Identity-gold?style=flat)](https://github.com/EremosCore/Eremos)
[![Unicode](https://img.shields.io/badge/Standard-Unicode-blue?style=flat)](https://unicode.org/)

</div>

## 📋 Table of Contents

- [🎯 Glyph System Overview](#-glyph-system-overview)
- [🔤 Active Agent Glyphs](#-active-agent-glyphs)
- [🎨 Visual Usage](#-visual-usage)
- [📝 Implementation Guide](#-implementation-guide)
- [🔮 Symbolic Meanings](#-symbolic-meanings)
- [⚡ Future Glyphs](#-future-glyphs)

## 🎯 Glyph System Overview

The Eremos glyph system provides **visual identification** for each agent in the swarm. These Unicode symbols serve as compact identifiers that appear in logs, signals, documentation, and future visualizations.

### Design Principles
- **Unique**: Each agent has a distinct glyph
- **Memorable**: Symbols that relate to agent function
- **Unicode Standard**: Cross-platform compatibility
- **Visual Clarity**: Easy to distinguish in logs and interfaces

### Glyph Categories
- **Mathematical**: Σ, Δ, λ - for analytical agents
- **Greek Letters**: ψ, Ϸ - for conceptual/mystical agents
- **Geometric**: φ - for observational agents
- **Custom**: ⚡ - for specialized functions

## 🔤 Active Agent Glyphs

<table>
<tr>
<th style="text-align: center; font-size: 24px;">Glyph</th>
<th>Agent</th>
<th>ID</th>
<th>Symbolic Meaning</th>
<th>Unicode</th>
<th>Role</th>
</tr>
<tr>
<td align="center" style="font-size: 32px;">Ϸ</td>
<td><strong>Theron</strong></td>
<td><code>agent-000</code></td>
<td>Memory / Echo / Primordial Wisdom</td>
<td><code>U+03F7</code></td>
<td>Memory Vault</td>
</tr>
<tr>
<td align="center" style="font-size: 32px;">Σ</td>
<td><strong>LaunchTracker</strong></td>
<td><code>agent-launch</code></td>
<td>Summation / Aggregation / Launch Detection</td>
<td><code>U+03A3</code></td>
<td>Launch Monitor</td>
</tr>
<tr>
<td align="center" style="font-size: 32px;">ψ</td>
<td><strong>Skieró</strong></td>
<td><code>agent-022</code></td>
<td>Soul / Spirit / Ghost Watching</td>
<td><code>U+03C8</code></td>
<td>Ghost Watcher</td>
</tr>
<tr>
<td align="center" style="font-size: 32px;">φ</td>
<td><strong>Observer</strong></td>
<td><code>agent-observer</code></td>
<td>Golden Ratio / Observation / Harmony</td>
<td><code>U+03C6</code></td>
<td>Surveillance</td>
</tr>
<tr>
<td align="center" style="font-size: 32px;">λ</td>
<td><strong>Harvester</strong></td>
<td><code>agent-harvester</code></td>
<td>Lambda / Flow / Functional Processing</td>
<td><code>U+03BB</code></td>
<td>Indexing</td>
</tr>
</table>

### Glyph Selection Rationale

#### **Ϸ (Theron)** - *Memory Vault*
- **Origin**: Ancient Greek letter "San"
- **Symbolism**: Represents archaic knowledge and primordial memory
- **Visual**: Resembles both 'M' (Memory) and historical inscription
- **Function**: Perfect for the first agent that stores all patterns

#### **Σ (LaunchTracker)** - *Launch Monitor*  
- **Origin**: Greek capital Sigma
- **Symbolism**: Mathematical summation, accumulation of evidence
- **Visual**: Strong, distinctive shape suggesting aggregation
- **Function**: Represents the summing up of launch indicators

#### **ψ (Skieró)** - *Ghost Watcher*
- **Origin**: Greek lowercase Psi
- **Symbolism**: Soul, spirit, psychological awareness
- **Visual**: Trident-like shape suggesting depth and mystery
- **Function**: Perfect for detecting "ghost" wallet reactivations

#### **φ (Observer)** - *Surveillance*
- **Origin**: Greek lowercase Phi
- **Symbolism**: Golden ratio, harmony, mathematical beauty
- **Visual**: Eye-like appearance with central focus
- **Function**: Represents balanced, harmonious observation

#### **λ (Harvester)** - *Indexing*
- **Origin**: Greek lowercase Lambda
- **Symbolism**: Functional programming, data flow, transformation
- **Visual**: Arrow-like shape suggesting data movement
- **Function**: Represents the functional processing of mint data

## 🎨 Visual Usage

### Log Output Examples

```typescript
// Signal logging with glyphs
[LaunchTracker] Σ → fresh funding detected from kraken at 04:41:12Z
[Skieró] ψ → dormant wallet reactivated after 247 days
[Observer] φ → wallet cluster formation detected (5 wallets)
[Harvester] λ → mint spike detected: 1,247 tokens in 60s
[Theron] Ϸ → pattern archived: anomaly_delta_003
```

### Signal Structure with Glyphs

```json
{
  "agent": "LaunchTracker",
  "type": "launch_detected",
  "glyph": "Σ",
  "hash": "sig_c7f9a3d2bc",
  "timestamp": "2025-01-15T04:41:25Z",
  "confidence": 0.91
}
```

### Terminal Display

```bash
🤖 Active Agents:
   Ϸ  Theron      (agent-000)      [Memory Vault]
   Σ  LaunchTracker (agent-launch) [Launch Monitor] 
   ψ  Skieró      (agent-022)      [Ghost Watcher]
   φ  Observer    (agent-observer) [Surveillance]
   λ  Harvester   (agent-harvester)[Indexing]
```

## 📝 Implementation Guide

### Using Glyphs in Code

```typescript
// Agent definition with glyph
export const MyAgent: Agent = {
  id: "agent-custom",
  name: "CustomAgent",
  glyph: "⚡",  // Custom glyph
  // ... other properties
  
  observe: (event) => {
    if (detectionLogic(event)) {
      logSignal({
        agent: "CustomAgent",
        type: "custom_detection",
        glyph: "⚡",  // Include glyph in signal
        hash: generateSignalHash(event),
        timestamp: new Date().toISOString()
      });
    }
  }
};
```

### Glyph Display Function

```typescript
// Utility function for glyph display
function displayAgentStatus(agent: Agent): string {
  return `${agent.glyph} ${agent.name} (${agent.id}) [${agent.role}]`;
}

// Usage
agents.forEach(agent => {
  console.log(displayAgentStatus(agent));
});
// Output: Ϸ Theron (agent-000) [memory_vault]
```

### Glyph Validation

```typescript
// Ensure glyph is a single Unicode character
function validateGlyph(glyph: string): boolean {
  return (
    typeof glyph === 'string' &&
    glyph.length === 1 &&
    glyph.trim() !== ''
  );
}
```

## 🔮 Symbolic Meanings

### Mathematical Symbols
- **Σ (Sigma)**: Summation, aggregation, total accumulation
- **Δ (Delta)**: Change, difference, detection of variance  
- **λ (Lambda)**: Function, transformation, data flow
- **φ (Phi)**: Golden ratio, balance, aesthetic harmony

### Ancient Greek Letters
- **Ϸ (San)**: Ancient wisdom, primordial knowledge, archival
- **ψ (Psi)**: Soul, spirit, psychological depth, hidden patterns

### Conceptual Associations
- **Memory**: Ϸ - Ancient letter for ancient memories
- **Detection**: Σ - Mathematical precision in pattern recognition
- **Observation**: φ - The eye of mathematical beauty
- **Spirit**: ψ - Ethereal watching of ghost wallets
- **Flow**: λ - Functional data processing streams

## ⚡ Future Glyphs

### Reserved for Agent-001+

<table>
<tr>
<th style="font-size: 24px;">Glyph</th>
<th>Unicode</th>
<th>Potential Meaning</th>
<th>Suggested Role</th>
</tr>
<tr>
<td align="center" style="font-size: 32px;">Ω</td>
<td><code>U+03A9</code></td>
<td>End / Finality / Ultimate Pattern</td>
<td>Final Analyzer</td>
</tr>
<tr>
<td align="center" style="font-size: 32px;">Θ</td>
<td><code>U+0398</code></td>
<td>Threshold / Boundary / Gate</td>
<td>Gateway Monitor</td>
</tr>
<tr>
<td align="center" style="font-size: 32px;">Ξ</td>
<td><code>U+039E</code></td>
<td>Structure / Unknown / Xi Factor</td>
<td>Pattern Builder</td>
</tr>
<tr>
<td align="center" style="font-size: 32px;">Π</td>
<td><code>U+03A0</code></td>
<td>Product / Multiplication / Network</td>
<td>Network Analyzer</td>
</tr>
<tr>
<td align="center" style="font-size: 32px;">⚡</td>
<td><code>U+26A1</code></td>
<td>Energy / Speed / Instant Response</td>
<td>Fast Response Agent</td>
</tr>
<tr>
<td align="center" style="font-size: 32px;">◊</td>
<td><code>U+25CA</code></td>
<td>Diamond / Precision / Rarity</td>
<td>Rare Event Detector</td>
</tr>
</table>

### Glyph Selection Guidelines

When creating new agents, consider:

1. **Visual Distinctiveness**: Easy to distinguish from existing glyphs
2. **Symbolic Relevance**: Meaning relates to agent function
3. **Unicode Compatibility**: Standard Unicode character
4. **Cultural Sensitivity**: Avoid symbols with negative connotations
5. **Aesthetic Harmony**: Fits with existing glyph family

### Custom Glyph Proposals

```typescript
// Template for proposing new glyphs
const glyphProposal = {
  agent: "ProposedAgent",
  glyph: "◈",
  unicode: "U+25C8", 
  meaning: "Focused Diamond - Precision Detection",
  rationale: "Represents focused, high-precision pattern detection",
  role: "precision_detector"
};
```

---

<div align="center">

**Visual identity through symbolic representation**

[![View Agents](https://img.shields.io/badge/View-Agents-blue?style=flat)](agents.md)
[![Join Community](https://img.shields.io/badge/Join-Community-green?style=flat)](https://x.com/EremosCore)

</div>
