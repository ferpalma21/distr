var path = require('path');

module.exports = function(app) {
  app.use('/user', require('../api/user/userRoutes'));

  // recoge error 404 y redirect to Angular
  app.all('/*', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
  });
};
