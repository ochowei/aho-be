const self = {
  RESPONSE_CODE: {
    "SUCCESS": 0, // ok

    // 100000 用戶相關
    "VERIFICATION_MAIL_SENT": 100001, // email已發過驗證信
    "EMAIL_EXIST": 100002, // email已註冊
    "PASSWORD_INVALID": 100003, // 驗證碼不符或已失效
    "USERID_EXIST": 100004, // 用戶ID已存在
    "EMAIL_NOT_EXIST": 100005, // email未註冊
    "USER_NOT_EXIST": 100006, // 用戶不存在
    "PASSWORD_ERROR": 100007, // 密碼錯誤
    "REFRESH_TOKEN_EXPIRED": 100026, //refresh token過期
    "REPAIR": 100036, // 功能維修中

    // 400xxx 參數錯誤相關
    "LACK_PARAMS": 400, // 缺少參數
    "INVALID_PARAMS": 400, // 參數錯誤
    "PARAMS_CONTAIN_FORBIDDEN_WORD": 400, // 參數包含被禁止的詞彙

    // 401xxx 驗證相關
    "UNAUTHORIZED": 401,
    // 403xxx 權限相關
    "PERMISSION_DENIED": 403, // 權限錯誤
    "TOO_MANY_REQUEST": 429,
    // 500000
    "UNHANDLED_ERROR": 500 // Unhandled Server error
  },

  RESPONSE_MSG: {
    "SUCCESS": "OK",

    // 100000 用戶相關
    "VERIFICATION_MAIL_SENT": "此email已發過驗證信",
    "EMAIL_EXIST": "email已註冊",
    "PASSWORD_INVALID": "驗證碼不符或已失效",
    "USERID_EXIST": "用戶ID已存在",
    "EMAIL_NOT_EXIST": "此email未註冊",
    "USER_NOT_EXIST": "用戶不存在",
    "PASSWORD_ERROR": "密碼錯誤",
    "REFRESH_TOKEN_EXPIRED": "Token已過期, 請重新登入",
    "REPAIR": "功能維修中",

    // 400xxx 參數錯誤相關
    "LACK_PARAMS": "缺少參數",
    "INVALID_PARAMS": "參數錯誤",
    "PARAMS_CONTAIN_FORBIDDEN_WORD": "參數包含被禁止的詞彙",

    // 401xxx 驗證相關
    "UNAUTHORIZED": "權限不足",
    // 403xxx 權限相關
    "PERMISSION_DENIED": "權限錯誤",
    "TOO_MANY_REQUEST": "請求過於頻繁",
    // 500000
    "UNHANDLED_ERROR": "未知錯誤" // Unhandled Server error
  },
  VALIDATOR: {
    PASSWORD_REQUIRED: "密碼為必填",
    EMAIL_REQUIRED: "信箱為必填",
    EMAIL_INVALID: "信箱格式錯誤"
  }
};

module.exports = self;
