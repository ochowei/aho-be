const axios = require('axios');

const logger = require('../../helpers/common/log')('user-service');
const {
  managementToken,
} = require('../../config/authconfig');
const helper = require('./helper');
/**

 * @returns {Promise<string>}
 */
const getManagementApiToken = async () => {
  const {
    // eslint-disable-next-line
    domain, client_id, client_secret, audience,
  } = managementToken;
  try {
    const response = await axios.post(`https://${domain}/oauth/token`, {
      // eslint-disable-next-line
      client_id,
      // eslint-disable-next-line
      client_secret,
      audience,
      grant_type: 'client_credentials',
    }, {
      headers: { 'Content-Type': 'application/json' },
    });

    return response.data.access_token; // This is your Management API token
  } catch (error) {
    logger.error('Error getting the management API token: ', error);
    throw error; // Rethrowing the error is useful if you want to handle it upstream
  }
};

const resendVerificationEmail = async (userId) => {
  const token = await getManagementApiToken();

  const data = JSON.stringify({
    user_id: userId,
    client_id: 'vwIsspkme08AYiR4EQzJ3iyEqgO1uu34',

  });
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://dev-8wbfhco65jfcy6ix.us.auth0.com/api/v2/jobs/verification-email',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,

    },
    data,
  };

  axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};

const self = {
  // middleware
  sendVerificationEmail: async (req, res) => {
    const { email } = req.body;
    const user = await helper.getUser(email);

    const userId = `auth0|${user.userId}`;
    try {
      await resendVerificationEmail(userId);
      res.status(200).json({ msg: 'Verification email sent' });
    } catch (error) {
      res.status(500).json({ msg: error.msg });
    }
  },
};
module.exports = self;
