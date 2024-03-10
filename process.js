module.exports = {
  handleInterrupt: (process, server) => {
    const logger = console;
    process.on('SIGINT', () => {
      logger.log('Received kill signal, shutting down gracefully');
      server.close(() => {
        logger.log('Closed out remaining connections');
        process.exit();
      });
    });
  },
  handleException: (process, logger) => {
    process.on('uncaughtException', (err) => {
      logger.error(err);
    });

    process.on('unhandledRejection', (err) => {
      if (err.code === 'ECONNABORTED') {
        logger.warn(err);
      } else {
        logger.error(err);
      }
    });
  },
};
