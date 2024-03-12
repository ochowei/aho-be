// @ts-check
const cls = require('simple-continuation-local-storage');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');

const log = require('../../helpers/common/log');

const logger = log('http');
const apiLogger = log('api');
const authConfig = require('../../config/authconfig');
const { RESPONSE_CODE } = require('../../helpers/common/response');
const { handleResponse } = require('../../services/common/response');

const self = {
  traceID: (req, res, next) => {
    const traceid = uuidv4();
    const localLogger = apiLogger.child({ traceid });
    res.locals.logger = localLogger;
    // @ts-ignore
    cls.traceid = traceid;
    // @ts-ignore
    cls.logger = localLogger;
    res.header('X-TRACE-ID', traceid);
    next();
  },

  log: (req, res, duration) => {
    const {
      method, ip, hostname, headers,
    } = req;

    const { statusCode } = res;
    const path = (req.baseUrl ?? '') + req.path;
    if (path.includes('/playone/docs') || path === '/commit_id') {
      return;
    }
    const { platform, version } = headers;
    const userId = headers['user-id'];
    const traceid = res.get('X-TRACE-ID');
    // TODO: ES key size limit
    // const query = req.query;
    // const queryKey = `query-${path}`;
    const text = {
      method,
      path,
      ip,
      hostname,
      duration,
      statusCode,
      // [queryKey]: query,
      platform,
      version,
      userId,
    };

    logger.trace({ log: text, traceid });
  },
  checkAuth0db: (req, res, next) => {
    const { secToken } = req.body;
    if (secToken !== authConfig.secToken) {
      const response = { msg: 'forbidden' };
      const code = RESPONSE_CODE.FORBIDDEN;
      res.response = { code, ...response };
      handleResponse(req, res);
      return;
    }
    next();
  },
  checkPassword: (req, res, next) => {
    /** @type {{ password: string}} */
    const { password } = req.body;
    if (!password) {
      res.response = { code: RESPONSE_CODE.INVALID_PARAMS, msg: 'password is required' };
      handleResponse(req, res);
      return;
    }
    if (password.length < 8 || password.length > 30) {
      res.response = { code: RESPONSE_CODE.INVALID_PARAMS, msg: 'password length should be at least 8 and less than 30' };
      handleResponse(req, res);
      return;
    }
    next();
  },
  checkEmail: (req, res, next) => {
    /** @type {{ email: string}} */
    const { email } = req.body;
    if (!email) {
      res.response = { code: RESPONSE_CODE.INVALID_PARAMS, msg: 'email is required' };
      handleResponse(req, res);
      return;
    }
    const schema = Joi.string().email();
    const { error } = schema.validate(email);
    if (error) {
      res.response = { code: RESPONSE_CODE.INVALID_PARAMS, msg: 'email is invalid' };
      handleResponse(req, res);
      return;
    }

    next();
  },
};

module.exports = self;
