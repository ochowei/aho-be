const momnent = require('moment-timezone');
const sequelize = require('sequelize');
const { models } = require('../../models');

const provider = 'auth0';

const self = {
  /**
     *
     * @param {string} sub
     * @param {number} page
     * @param {number} pageSize
     * @returns {Promise<{rows: Array<{
     *  userId: number,
     *  nickname: string,
     *  lastSession: Date,
     *  lastLogin: Date,
     *  loginCount: number,
     *  email: string,
     *  createdAt: Date
     * }>, count: number}>}
     */
  listUsers: async (sub, page = 1, pageSize = 20) => {
    const subs = sub.split('|');
    if (subs.length === 2 && subs[0] === provider && !Number.isNaN(Number(subs[1]))) {
      const user = await models.User.findOne({
        where: {
          userId: Number(subs[1]),
          emailVerified: true,
        },
        attributes: ['userId'],
        raw: true,
      });

      if (!user) {
        return {
          rows: [],
          count: -1,
        };
      }
    }

    const attributes = ['userId', 'nickname', 'lastSession', 'lastLogin', 'loginsCount', 'email', 'createdAt'];
    const users = await models.User.findAndCountAll({
      order: [['userId', 'DESC']],
      attributes,
      limit: pageSize,
      offset: (page - 1) * pageSize,
      raw: true,
    });

    return users;
  },
  /**
   *
   * @param {string} sub
   * @returns {Promise<{userCount: number,
   *  userSessionCount: {todayTotal: number, last7DaysAverage: number}}>}
   */
  summaryUsers: async (sub) => {
    const subs = sub.split('|');
    if (subs.length === 2 && subs[0] === provider && !Number.isNaN(Number(subs[1]))) {
      const user = await models.User.findOne({
        where: {
          userId: Number(subs[1]),
          emailVerified: true,
        },
        attributes: ['userId'],
        raw: true,
      });
      if (!user) {
        return {
          userCount: -1,
          userSessionCount: {
            todayTotal: 0,
            last7DaysAverage: 0,
          },
        };
      }
    }

    const timezone = 'UTC';
    const userCount = await models.User.count();
    const userSessionCount = {
      todayTotal: 0,
      last7DaysAverage: 0,
    };
    const today = momnent().tz(timezone).startOf('day');
    const last7Days = momnent().tz(timezone).subtract(7, 'days').startOf('day');
    const last7DaysCountGroup = await models.User.findAll({
      attributes: ['lastSessionDateOnly',
        [sequelize.fn('COUNT', sequelize.col('userId')), 'count']],
      where: {
        lastSession: {
          [sequelize.Op.gte]: last7Days.toDate(),
        },
      },
      group: ['lastSessionDateOnly'],
    });
    const last7DaysCount = last7DaysCountGroup.reduce((acc, row) => acc + row.get('count'), 0);
    const days = last7DaysCountGroup.length || 1;
    const todayCount = await models.User.count({
      where: {
        lastSession: {
          [sequelize.Op.gte]: today.toDate(),
        },
      },
    });
    userSessionCount.todayTotal = todayCount;
    userSessionCount.last7DaysAverage = last7DaysCount / days;

    return {
      userCount,
      userSessionCount,
    };
  },

  /**
   *
   * @param {string} sub
   * @param {Date} date
   */
  updateSessionTime: async (sub, date) => {
    const subs = sub.split('|');
    let querySub = sub;
    if (subs.length >= 2 && subs[0] === provider && !Number.isNaN(Number(subs[1]))) {
      const userId = Number(subs[1]);
      const user = await models.User.findOne({
        where: {
          userId,
        },
        attributes: ['userId', 'sub'],
      });
      querySub = user.sub;
    }
    await models.User.update({
      lastSession: date,
      lastSessionDateOnly: date,
    }, {
      where: {
        sub: querySub,
        lastSession: {
          [sequelize.Op.lt]: date,
        },
      },
    });
  },

  upsertUserProfile: async (sub, email) => {
    const [user] = await models.User.findOrCreate({
      where: {
        sub,
      },
      attributes: ['userId'],
      defaults: {
        email,
      },
    });

    return user;
  },
};

module.exports = self;
