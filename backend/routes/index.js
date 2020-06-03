const appRoute = require('./app');
const authRoute = require('./auth');

module.exports = app => {
  app.use('/', appRoute);
};