const express = require('express');
require('express-async-errors');
const cors = require('cors');
// const nunjucks = require('nunjucks');
// const passport = require('passport');
const responseTime = require('response-time');
const swaggerUi = require('swagger-ui-express');
const config = require('./config');
const { RESPONSE_CODE, RESPONSE_MSG } = require('./helpers/common/response');
const { handleInterrupt, handleException } = require('./process');
const logger = require('./helpers/common/log')('uncaught');

const consoleLogger = console;

const app = express();

app.disable('etag');
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const { setupMysql, initSequelize } = require('./connections/mysql');

initSequelize(config.mysql); // TODO: error handle
const middleware = require('./middlewares/common/handler');
const routes = require('./routes');

app.use(middleware.traceID);
app.use(responseTime(middleware.log));

routes.setup(app);

const PORT = config.api.master.port || 3000;

const swaggerSpec = require('./config/swagger');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

{
  // errorHandler 必須是最後一個註冊的 middleware

  // eslint-disable-next-line no-unused-vars
  const errorHandler = (err, req, res, next) => {
    if (res?.locals?.logger) {
      res.locals.logger.error(err);
    } else {
      consoleLogger.error(err);
    }

    const response = {
      code: RESPONSE_CODE.UNHANDLED_ERROR,
      msg: RESPONSE_MSG.UNHANDLED_ERROR,
      data: {},
    };
    res.send({ response });
  };

  app.use(errorHandler);
}

// nunjucks.configure("config/templates", { autoescape: true });

const afterServer = async () => {
  consoleLogger.log(`[SERVER] server listen on ${PORT}`);
  try {
    await setupMysql(config.mysql);
    consoleLogger.log('[MYSQL] connect to mysql successful');
  } catch (error) {
    consoleLogger.error(error);
  }
};
const server = app.listen(PORT, afterServer);

handleInterrupt(process, server);
handleException(process, logger);

module.exports = server;
