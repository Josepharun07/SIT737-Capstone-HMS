type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  data?: any;
}

class FrontendLogger {
  private isDevelopment = import.meta.env.DEV;

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, context, message } = entry;
    const contextStr = context ? `[${context}]` : '';
    return `${timestamp} ${level.toUpperCase()} ${contextStr} ${message}`;
  }

  private log(level: LogLevel, message: string, context?: string, data?: any) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      data,
    };

    const formattedLog = this.formatLog(entry);
    const colors = {
      info: 'color: #22c55e',
      warn: 'color: #f59e0b',
      error: 'color: #ef4444',
      debug: 'color: #3b82f6',
    };

    if (this.isDevelopment || level !== 'debug') {
      console.log(`%c${formattedLog}`, colors[level], data || '');
    }

    try {
      const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
      logs.push(entry);
      if (logs.length > 50) logs.shift();
      localStorage.setItem('app_logs', JSON.stringify(logs));
    } catch (e) {
      // Ignore
    }
  }

  info(message: string, context?: string, data?: any) {
    this.log('info', message, context, data);
  }

  warn(message: string, context?: string, data?: any) {
    this.log('warn', message, context, data);
  }

  error(message: string, error?: Error, context?: string) {
    console.error(message, error);
    this.log('error', message, context, { error: error?.message });
  }

  debug(message: string, context?: string, data?: any) {
    this.log('debug', message, context, data);
  }

  getLogs(): LogEntry[] {
    try {
      return JSON.parse(localStorage.getItem('app_logs') || '[]');
    } catch {
      return [];
    }
  }

  clearLogs() {
    localStorage.removeItem('app_logs');
  }
}

export const logger = new FrontendLogger();
