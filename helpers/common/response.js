const self = {
  RESPONSE_CODE: {
    SUCCESS: 0, // ok

    USERID_EXIST: 409,
    NOT_FOUND: 404,
    INVALID_PARAMS: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    TOO_MANY_REQUEST: 429,
    UNHANDLED_ERROR: 500, // Unhandled Server error

  },

};

module.exports = self;
