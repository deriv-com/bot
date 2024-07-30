const path = require('path');

const resources = ['_constants.scss', '_mixins.scss', '_fonts.scss', '_inline-icons.scss', '_devices.scss'];

module.exports = resources.map(file => path.resolve(__dirname, file));
