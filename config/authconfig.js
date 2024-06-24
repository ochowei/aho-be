const config = {
  secToken: '123456',
  domain: '',
  client_id: '',
  audience: '',
  managementToken: {
    domain: '',
    client_id: '',
    client_secret: '',
    audience: '',
    grant_type: 'client_credentials',
  },
};
// if file exists, override the default config
try {
  // read file by fs
  const overrides = {
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID,
    audience: process.env.AUTH0_AUDIENCE,
    secToken: process.env.AUTH0_SECTOKEN,
  };

  config.secToken = overrides.secToken;
  config.managementToken = overrides.managementToken;
} catch (err) {
  // eslint-disable-next-line no-console
  console.log('No auth_config file found, using defaults');
}
module.exports = Object.freeze(config);
