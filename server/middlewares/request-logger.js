import morgan from 'morgan';
import logger from '../configs/logger.js';

const stream = {
  write: (message) => {
    logger.http(message.trim());
  }
};

const requestLogger = morgan('dev', { stream });

export default requestLogger;
