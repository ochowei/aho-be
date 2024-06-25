const self = {
  /**
   *
   * res.response object
   * @param type default "application/json"
   * @param code number default 0
   * @param msg string default `method /path successful`
   * @param data object default {}
   */
  handleResponse: async (req = {}, res = {}) => {
    if (!res.response) res.response = {};
    const {
      code = 0,
      msg = `${req.method} ${req.url} successful`,
      data = {},
    } = res.response;
    if (code !== 0) {
      // res.locals.logger.warn(`msg: ${msg}`);
      res.status(code);
    }
    const response = { msg, data };
    // res.set('Content-Type', type);
    res.json(response);
  },

  /**
   *
   * res.response object
   * @param type default "application/json"
   * @param code number default 0
   * @param msg string default `method /path successful`
   * return message only
   */
  handleOnlyStringResponse: async (req = {}, res = {}) => {
    if (!res.response) res.response = {};
    const {
      type = 'application/json',
      code = 0,
      msg = `${req.method} ${req.baseUrl}${req.path} successful`,
    } = res.response;
    if (code !== 0) {
      res.locals.logger.warn(`code: ${code}`);
    }
    const response = code === 0 ? msg : { code, msg };
    res.set('Content-Type', type);
    res.send(response);
  },
};

module.exports = self;
