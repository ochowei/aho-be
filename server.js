const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const nunjucks = require("nunjucks");
const passport = require("passport");
const responseTime = require("response-time");
const config = require("./config");

app.disable("etag");
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const { setupMysql, initSequelize } = require("./connections/mysql");

initSequelize(config.mysql); // TODO: error handle
const middleware = require("./middlewares/common/handler");
const routes = require("./routes");
app.use(middleware.traceID);
app.use(responseTime(middleware.log));

routes.setup(app);

const PORT = config.api.master.port || 3000;

const swaggerSpec = require("./config/swagger");
const swaggerUi = require("swagger-ui-express");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

{
  // errorHandler 必須是最後一個註冊的 middleware
  const { RESPONSE_CODE, RESPONSE_MSG } = require("./helpers/common/response");
  // eslint-disable-next-line no-unused-vars
  const errorHandler = (err, req, res, next) => {
    if (res?.locals?.logger) {
      res.locals.logger.error(err);
    } else {
      console.error(err);
    }

    const response = {
      code: RESPONSE_CODE.UNHANDLED_ERROR,
      msg: RESPONSE_MSG.UNHANDLED_ERROR,
      data: {}
    };
    res.send({ response });
  };

  app.use(errorHandler);
}

// nunjucks.configure("config/templates", { autoescape: true });

const afterServer = async () => {
  console.log(`[SERVER] server listen on ${PORT}`);
  try {
    await setupMysql(config.mysql);
    console.log("[MYSQL] connect to mysql successful");
  } catch (error) {
    console.error(error);
  }
};
const server = app.listen(PORT, afterServer);

{
  const { handleInterrupt, handleException } = require("./process");
  handleInterrupt(process, server);
  const logger = require("./helpers/common/log")("uncaught");
  handleException(process, logger);
}

module.exports = server;
