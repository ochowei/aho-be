const express = require('express');
require('express-async-errors');
const cors = require('cors');
// const nunjucks = require('nunjucks');
// const passport = require('passport');
const responseTime = require('response-time');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const YAML = require('yaml');

const config = require('./config');
const { RESPONSE_CODE } = require('./helpers/common/response');
const { handleInterrupt, handleException } = require('./process');
const logger = require('./helpers/common/log')('uncaught');
require('dotenv').config(); // Load the .env variables

const file = fs.readFileSync('./docs/swagger.yaml', 'utf8');

const swaggerDocument = YAML.parse(file);
const consoleLogger = console;

const app = express();

app.disable('etag');
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const { initSequelize } = require('./connections/mysql');

const mysqlConfig = {
  master: {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    ca: process.env.MYSQL_CA,
  },
};
initSequelize(mysqlConfig); // TODO: error handle

const middleware = require('./middlewares/common/handler');
const routes = require('./routes');

app.use(middleware.traceID);
app.use(responseTime(middleware.log));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

routes.setup(app);

const PORT = config.api.master.port || 3000;

// const swaggerSpec = require('./config/swagger');

// app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
      data: {},
    };
    res.send({ response });
  };

  app.use(errorHandler);
}

// nunjucks.configure("config/templates", { autoescape: true });

const afterServer = async () => {
  consoleLogger.log(`[SERVER] server listen on ${PORT}`);
};
const server = app.listen(PORT, afterServer);

handleInterrupt(process, server);
handleException(process, logger);

module.exports = server;
