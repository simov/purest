
module.exports = require('./lib/purest')(
  require('@request/client'),
  require('@request/api'),
  require('@purest/config'),
  require('extend')
)
