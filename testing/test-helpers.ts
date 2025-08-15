import { Signal } from '../types/signal';
import { AlertRule } from '../utils/analytics';
import { generateSignalHash } from '../utils/signal';

export function createTestSignal(partial: Partial<Signal> & { type: string }): Signal {
  return {
    type: partial.type,
    hash: partial.hash || generateSignalHash(partial.type),
    timestamp: partial.timestamp || new Date().toISOString(),
    source: partial.source || partial.agent || 'test-agent',
    agent: partial.agent,
    id: partial.id,
    glyph: partial.glyph,
    confidence: partial.confidence,
    metadata: partial.metadata,
  };
}

export function createTestAlertRule(partial: Partial<AlertRule> & { id: string }): AlertRule {
  return {
    id: partial.id,
    name: partial.name || `Test Rule ${partial.id}`,
    condition: partial.condition || (() => false),
    priority: partial.priority || 'medium',
    cooldown: partial.cooldown || 30000,
    enabled: partial.enabled !== undefined ? partial.enabled : true,
    description: partial.description || `Test alert rule ${partial.id}`,
  };
}
