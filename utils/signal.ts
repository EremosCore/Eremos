export function generateSignalHash(event: any): string {
  const base = JSON.stringify(event) + Date.now();
  // Simple hash function that works without additional types
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    const char = base.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const hashStr = Math.abs(hash).toString(36).slice(0, 10);
  return "sig_" + hashStr;
}
