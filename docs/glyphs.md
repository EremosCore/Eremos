# Glyphs

_Explanation of glyphs used in logs, UI, and signals to give quick visual cues._

---

## At a Glance

- Scope: Glyph meanings and recommended uses.
- Audience: UI designers, analysts, and operators.

---

## Common Glyphs

- Δ — Launch / New token detected
- ⚑ — Flag / Suspicious activity
- ✓ — Validation passed
- ✖ — Validation failed
- ⚡ — High-confidence / urgent

---

## Usage Guidelines

- Use glyphs sparingly; they are visual shorthand, not a replacement for metadata.
- Combine glyph with structured fields: glyph + type + confidence.
- Keep glyph set small and documented so UIs and integrators stay consistent.

---

## Example Signal (with glyph)
```json
{
  "agent": "theron",
  "type": "launch_detected",
  "glyph": "Δ",
  "confidence": 0.91
}
```

---

## Related Docs

- [Signals](./signals.md)
- [README](../README.md)
