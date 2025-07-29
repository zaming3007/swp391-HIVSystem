export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    NONE = 4
}

export interface LogEntry {
    level: LogLevel;
    message: string;
    data?: any;
    timestamp: Date;
    service?: string;
}

/**
 * Centralized logging service with configurable levels and structured output
 */
export class Logger {
    private currentLevel: LogLevel;
    private isDevelopment: boolean;

    constructor() {
        // Set log level based on environment
        this.isDevelopment = import.meta.env.DEV || import.meta.env.NODE_ENV === 'development';
        this.currentLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.WARN;
    }

    /**
     * Set the minimum log level
     */
    setLevel(level: LogLevel): void {
        this.currentLevel = level;
    }

    /**
     * Get the current log level
     */
    getLevel(): LogLevel {
        return this.currentLevel;
    }

    /**
     * Log a debug message
     */
    debug(message: string, data?: any): void {
        this.log(LogLevel.DEBUG, message, data);
    }

    /**
     * Log an info message
     */
    info(message: string, data?: any): void {
        this.log(LogLevel.INFO, message, data);
    }

    /**
     * Log a warning message
     */
    warn(message: string, data?: any): void {
        this.log(LogLevel.WARN, message, data);
    }

    /**
     * Log an error message
     */
    error(message: string, data?: any): void {
        this.log(LogLevel.ERROR, message, data);
    }

    /**
     * Core logging method
     */
    private log(level: LogLevel, message: string, data?: any): void {
        // Skip if log level is below current threshold
        if (level < this.currentLevel) {
            return;
        }

        const logEntry: LogEntry = {
            level,
            message,
            data,
            timestamp: new Date()
        };

        // Format and output the log entry
        this.output(logEntry);
    }

    /**
     * Output the log entry to console with appropriate formatting
     */
    private output(entry: LogEntry): void {
        const timestamp = entry.timestamp.toISOString();
        const levelName = LogLevel[entry.level];
        const prefix = `[${timestamp}] [${levelName}]`;

        switch (entry.level) {
            case LogLevel.DEBUG:
                if (entry.data) {
                    console.debug(prefix, entry.message, entry.data);
                } else {
                    console.debug(prefix, entry.message);
                }
                break;

            case LogLevel.INFO:
                if (entry.data) {
                    console.info(prefix, entry.message, entry.data);
                } else {
                    console.info(prefix, entry.message);
                }
                break;

            case LogLevel.WARN:
                if (entry.data) {
                    console.warn(prefix, entry.message, entry.data);
                } else {
                    console.warn(prefix, entry.message);
                }
                break;

            case LogLevel.ERROR:
                if (entry.data) {
                    console.error(prefix, entry.message, entry.data);
                } else {
                    console.error(prefix, entry.message);
                }
                break;
        }
    }

    /**
     * Create a scoped logger for a specific service
     */
    createServiceLogger(serviceName: string): ServiceLogger {
        return new ServiceLogger(this, serviceName);
    }
}

/**
 * Service-specific logger that automatically includes service name
 */
export class ServiceLogger {
    constructor(
        private logger: Logger,
        private serviceName: string
    ) {}

    debug(message: string, data?: any): void {
        this.logger.debug(`[${this.serviceName}] ${message}`, data);
    }

    info(message: string, data?: any): void {
        this.logger.info(`[${this.serviceName}] ${message}`, data);
    }

    warn(message: string, data?: any): void {
        this.logger.warn(`[${this.serviceName}] ${message}`, data);
    }

    error(message: string, data?: any): void {
        this.logger.error(`[${this.serviceName}] ${message}`, data);
    }
}

// Export singleton instance
export const logger = new Logger();
