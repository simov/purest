
var extend = require('extend')
var api = require('@request/api')


module.exports = (ctor, request) => {

  return api({
    type: 'basic',
    request: (options) => {
      var opts = {}

      if (ctor.defaults) {
        extend(true, opts, ctor.defaults, options)
      }
      else {
        opts = options
      }

      return request(opts)
    }
  })
}
