import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CustomLoggerService implements NestLoggerService {
  private logDir = path.join(process.cwd(), '../../logs');

  constructor() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private getLogFileName(type: string = 'application'): string {
    const date = new Date().toISOString().split('T')[0];
    return path.join(this.logDir, `${type}-${date}.log`);
  }

  private writeLog(level: string, message: string, context?: string, trace?: string) {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}]` : '';
    const logMessage = `${timestamp} ${level.toUpperCase()} ${contextStr} ${message}${trace ? `\n${trace}` : ''}\n`;

    const fileName = level === 'error' ? this.getLogFileName('error') : this.getLogFileName('application');
    
    try {
      fs.appendFileSync(fileName, logMessage);
    } catch (error) {
      console.error('Failed to write log:', error);
    }

    const colors: Record<string, string> = {
      log: '\x1b[32m',
      error: '\x1b[31m',
      warn: '\x1b[33m',
      debug: '\x1b[36m',
      verbose: '\x1b[35m'
    };
    const color = colors[level] || '';
    const reset = '\x1b[0m';

    console.log(`${color}${timestamp} ${level.toUpperCase()}${reset} ${contextStr} ${message}`);
  }

  log(message: string, context?: string) {
    this.writeLog('log', message, context);
  }

  error(message: string, trace?: string, context?: string) {
    this.writeLog('error', message, context, trace);
  }

  warn(message: string, context?: string) {
    this.writeLog('warn', message, context);
  }

  debug(message: string, context?: string) {
    this.writeLog('debug', message, context);
  }

  verbose(message: string, context?: string) {
    this.writeLog('verbose', message, context);
  }

  audit(action: string, userId: string, details: any) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} AUDIT action="${action}" userId="${userId}" details=${JSON.stringify(details)}\n`;
    
    const auditFile = this.getLogFileName('audit');
    try {
      fs.appendFileSync(auditFile, logMessage);
    } catch (error) {
      console.error('Failed to write audit log:', error);
    }
  }

  performance(endpoint: string, duration: number, statusCode: number) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} PERFORMANCE endpoint="${endpoint}" duration=${duration}ms status=${statusCode}\n`;
    
    try {
      fs.appendFileSync(this.getLogFileName('application'), logMessage);
    } catch (error) {
      console.error('Failed to write performance log:', error);
    }
  }
}
