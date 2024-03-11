const momnent = require('moment-timezone');
const sequelize = require('sequelize');
const { models } = require('../../models');

const self = {
  /**
     *
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
  listUsers: async (page = 1, pageSize = 20) => {
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
   * @param {string} timezone
   * @returns {Promise<{userCount: number,
   *  userSessionCount: {todayTotal: number, last7DaysAverage: number}}>}
   */
  summaryUsers: async () => {
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
    const days = last7DaysCountGroup.length;
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
};

module.exports = self;
