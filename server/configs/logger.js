import winston from 'winston';
const { combine, timestamp, printf, colorize, align, errors } = winston.format;

function level() {
  if (process.env.LOG_LEVEL) {
    if (process.env.LOG_LEVEL === '0' || process.env.LOG_LEVEL === 'error') return 'error';
    if (process.env.LOG_LEVEL === '1' || process.env.LOG_LEVEL === 'warn') return 'warn';
    if (process.env.LOG_LEVEL === '2' || process.env.LOG_LEVEL === 'info') return 'info';
    if (process.env.LOG_LEVEL === '3' || process.env.LOG_LEVEL === 'http') return 'http';
    if (process.env.LOG_LEVEL === '4' || process.env.LOG_LEVEL === 'verbose') return 'verbose';
    if (process.env.LOG_LEVEL === '5' || process.env.LOG_LEVEL === 'debug') return 'debug';
    if (process.env.LOG_LEVEL === '6' || process.env.LOG_LEVEL === 'silly') return 'silly';
  }
  return 'http';
}

const logger = winston.createLogger({
  level: level(),
  format: combine(
    colorize({ all: true }),
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.stack ? info.message + "\n" + info.stack : info.message}`)
  ),
  transports: [new winston.transports.Console()]
});

export default logger;
