import { Signal } from '../types/signal';

/**
 * Log levels for controlling output verbosity
 */
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

/**
 * Logger configuration
 */
interface LoggerConfig {
  level: LogLevel;
  includeTimestamp: boolean;
  colorEnabled: boolean;
}

/**
 * Default logger configuration
 */
const defaultConfig: LoggerConfig = {
  level: LogLevel.INFO,
  includeTimestamp: true,
  colorEnabled: true
};

let currentConfig = { ...defaultConfig };

/**
 * ANSI color codes for colored output
 */
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

/**
 * Configure the logger
 * @param config - Partial configuration to override defaults
 */
export function configureLogger(config: Partial<LoggerConfig>): void {
  currentConfig = { ...currentConfig, ...config };
}

/**
 * Colorize text if colors are enabled
 * @param text - Text to colorize
 * @param color - Color to apply
 * @returns Colorized or plain text
 */
function colorize(text: string, color: string): string {
  return currentConfig.colorEnabled ? `${color}${text}${colors.reset}` : text;
}

/**
 * Format timestamp for logs
 * @returns Formatted timestamp string
 */
function getTimestamp(): string {
  return currentConfig.includeTimestamp 
    ? `${colorize(new Date().toISOString(), colors.gray)} ` 
    : '';
}

/**
 * Log a signal emission with structured output
 * 
 * @param signal - The signal to log
 */
export function logSignal(signal: {
  agent: string;
  type: string;
  glyph: string;
  hash: string;
  timestamp: string;
  confidence?: number;
  details?: Record<string, any>;
}): void {
  if (currentConfig.level < LogLevel.INFO) return;

  const agentName = colorize(`[${signal.agent}]`, colors.cyan);
  const glyph = colorize(signal.glyph, colors.magenta);
  const hash = colorize(signal.hash, colors.yellow);
  const type = colorize(signal.type, colors.blue);
  
  let logLine = `${getTimestamp()}${agentName} ${glyph} stored signal ${hash} (${type})`;
  
  if (signal.confidence !== undefined) {
    const confidenceColor = signal.confidence > 0.8 ? colors.green : 
                           signal.confidence > 0.5 ? colors.yellow : colors.red;
    const confidenceStr = colorize(`${(signal.confidence * 100).toFixed(1)}%`, confidenceColor);
    logLine += ` confidence: ${confidenceStr}`;
  }
  
  console.log(logLine);
  
  if (signal.details && Object.keys(signal.details).length > 0) {
    console.log(`${colorize('├─ context:', colors.gray)}`);
    const keys = Object.keys(signal.details);
    keys.forEach((key: string, index: number) => {
      const value = signal.details![key];
      const isLast = index === keys.length - 1;
      const prefix = isLast ? '└─' : '├─';
      const keyStr = colorize(key, colors.bright);
      console.log(`   ${colorize(prefix, colors.gray)} ${keyStr}: ${JSON.stringify(value)}`);
    });
  }
}

/**
 * Log an error message
 * @param message - Error message
 * @param error - Optional error object
 */
export function logError(message: string, error?: Error): void {
  if (currentConfig.level < LogLevel.ERROR) return;
  
  const errorMsg = colorize(`[ERROR] ${message}`, colors.red);
  console.error(`${getTimestamp()}${errorMsg}`);
  
  if (error) {
    console.error(colorize(`├─ ${error.message}`, colors.gray));
    if (error.stack) {
      console.error(colorize(`└─ ${error.stack}`, colors.gray));
    }
  }
}

/**
 * Log a warning message
 * @param message - Warning message
 */
export function logWarning(message: string): void {
  if (currentConfig.level < LogLevel.WARN) return;
  
  const warnMsg = colorize(`[WARN] ${message}`, colors.yellow);
  console.warn(`${getTimestamp()}${warnMsg}`);
}

/**
 * Log an info message
 * @param message - Info message
 */
export function logInfo(message: string): void {
  if (currentConfig.level < LogLevel.INFO) return;
  
  const infoMsg = colorize(`[INFO] ${message}`, colors.blue);
  console.log(`${getTimestamp()}${infoMsg}`);
}

/**
 * Log a debug message
 * @param message - Debug message
 * @param data - Optional data to include
 */
export function logDebug(message: string, data?: any): void {
  if (currentConfig.level < LogLevel.DEBUG) return;
  
  const debugMsg = colorize(`[DEBUG] ${message}`, colors.gray);
  console.log(`${getTimestamp()}${debugMsg}`);
  
  if (data !== undefined) {
    console.log(colorize(`└─ ${JSON.stringify(data, null, 2)}`, colors.gray));
  }
}
