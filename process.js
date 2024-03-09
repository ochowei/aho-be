module.exports = {
  handleInterrupt: (process, server) => {
    process.on("SIGINT", () => {
      console.log("Received kill signal, shutting down gracefully");
      server.close(() => {
        console.log("Closed out remaining connections");
        process.exit();
      });
    });
  },
  handleException: (process, logger) => {
    process.on("uncaughtException", (err) => {
      logger.error(err);
    });

    process.on("unhandledRejection", (err) => {
      if (err.code === "ECONNABORTED") {
        logger.warn(err);
      } else {
        logger.error(err);
      }
    });
  }
};
