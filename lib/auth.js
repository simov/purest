
var def = require('../config/methods')

module.exports = (options) => {

  if (typeof options.auth === 'string' || options.auth instanceof Array) {
    var index = 0
    var auth = [].concat(options.auth)
    options = JSON.parse(JSON.stringify(options)
      .replace(/\$auth/g, (match, offset, string) => auth[index++]))
    if (options._auth) {
      options.auth = options._auth
    }
    else {
      // conflicts with request-compose auth
      delete options.auth
    }
  }

  return options

}
