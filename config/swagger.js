const swaggerJSDoc = require('swagger-jsdoc');

// const swaggerDefinition = {
// info: {
//   title: 'aho-be api', // Title (required)
//   version: '1.0.0', // Version (required)
//   description: 'aho-be api', // Description (optional)
// },
// components: {},
// host: config.post.host // Host (optional)
// basePath: "/" // Base path (optional)
// };

// Options for the swagger docs
const options = {
  apis: ['./docs/*.yaml'],
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
