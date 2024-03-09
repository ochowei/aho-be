const log = require("../../helpers/common/log");
const logger = log("http");
const apiLogger = log("api");
const { v4: uuidv4 } = require("uuid");
const cls = require("simple-continuation-local-storage");

const self = {
  traceID: (req, res, next) => {
    const traceid = uuidv4();
    const localLogger = apiLogger.child({ "traceid": traceid });
    res.locals.logger = localLogger;
    cls.traceid = traceid;
    cls.logger = localLogger;
    res.header("X-TRACE-ID", traceid);
    next();
  },

  log: (req, res, duration) => {
    const { method, ip, hostname, headers } = req;
    const { statusCode } = res;
    const path = (req.baseUrl ?? "") + req.path;
    if (path.includes("/playone/docs") || path === "/commit_id") {
      return;
    }
    const { platform, version } = headers;
    const userId = headers["user-id"];
    const traceid = res.get("X-TRACE-ID");
    // TODO: ES key size limit
    //const query = req.query;
    //const queryKey = `query-${path}`;
    const text = {
      method,
      path,
      ip,
      hostname,
      duration,
      statusCode,
      //[queryKey]: query,
      platform,
      version,
      userId
    };

    logger.trace({ log: text, traceid });
  }
};

module.exports = self;
