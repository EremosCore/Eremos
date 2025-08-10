import { BlockchainEvent } from '../types/agent';

/**
 * Generates a unique, deterministic hash for a blockchain event
 * 
 * Uses a simple but effective hashing approach that's deterministic
 * and provides good collision resistance for signal identification.
 * 
 * @param event - The blockchain event to hash
 * @returns A unique signal hash with 'sig_' prefix
 */
export function generateSignalHash(event: BlockchainEvent): string {
  // Create deterministic string from event (excluding timestamp for consistency)
  const eventData = {
    type: event.type,
    data: event.data || {},
    // Exclude timestamp to make hash deterministic for same event
  };
  
  const eventString = JSON.stringify(eventData, Object.keys(eventData).sort());
  
  // Simple hash function that's deterministic and provides good distribution
  let hash = 0;
  for (let i = 0; i < eventString.length; i++) {
    const char = eventString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to hex and ensure 12 characters
  const hexHash = ('000000000000' + Math.abs(hash).toString(16)).slice(-12);
  
  return `sig_${hexHash}`;
}

/**
 * Generates a time-based unique hash when deterministic hashing is not desired
 * 
 * @param event - The blockchain event to hash
 * @returns A unique signal hash with 'sig_' prefix including timestamp
 */
export function generateUniqueSignalHash(event: BlockchainEvent): string {
  const base = JSON.stringify(event) + Date.now() + Math.random();
  
  // Simple hash with timestamp and random component
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    const char = base.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  const hexHash = ('000000000000' + Math.abs(hash).toString(16)).slice(-12);
  
  return `sig_${hexHash}`;
}

/**
 * Extracts signal ID from a full signal hash
 * 
 * @param signalHash - Full signal hash (e.g., "sig_abc123def456")
 * @returns Short signal ID (e.g., "abc123def456")
 */
export function extractSignalId(signalHash: string): string {
  return signalHash.replace(/^sig_/, '');
}

/**
 * Validates that a string is a properly formatted signal hash
 * 
 * @param hash - String to validate
 * @returns True if the hash follows the expected format
 */
export function isValidSignalHash(hash: string): boolean {
  return /^sig_[a-f0-9]{12}$/.test(hash);
}
