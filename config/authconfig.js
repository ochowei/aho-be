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
const fs = require('fs');
// if file exists, override the default config
try {
  // read file by fs
  const stringContent = fs.readFileSync(`${__dirname}/auth_config.json`, 'utf8');
  const overrides = JSON.parse(stringContent);

  config.secToken = overrides.secToken;
  config.managementToken = overrides.managementToken;
} catch (err) {
  // eslint-disable-next-line no-console
  console.log('No auth_config file found, using defaults');
}
module.exports = Object.freeze(config);
