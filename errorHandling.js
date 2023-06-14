
import logger from './logger.js'

// Log uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception: ', err);
});

// Log unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Promise Rejection: ', promise, ' Reason: ', reason);
});

// Log server shutdown
process.on('exit', (code) => {
    logger.info(`Server shutdown with exit code: ${code}`);
});