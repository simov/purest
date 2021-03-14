
var cache = []

var replacer = () => {
  return (key, value) => {
    if (typeof value === 'object' && value.constructor.name !== 'Object') {
      cache.push(value)
      return '$token'
    }
    else {
      return value
    }
  }
}

var reviver = () => {
  var index = 0
  return (key, value) => {
    if (value === '$token') {
      return cache[index++]
    }
    else {
      return value
    }
  }
}

module.exports = (options) => {
  cache = []

  if (typeof options.auth === 'string' || options.auth instanceof Array) {
    var index = 0
    var auth = [].concat(options.auth)

    options = JSON.parse(
      JSON.stringify(options, replacer())
        .replace(/{auth}/g, (match, offset, string) => auth[index++]),
      reviver())
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
