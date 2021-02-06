
var def = require('../config/methods')

module.exports = (options) => {

  if (options.url) {
    return options
  }

  var method = Object.keys(options)
    .find((key) => Object.keys(def.methods).includes(key))

  if (/^https?/.test(options[method])) {
    options.url = options[method]
    return options
  }

  options.url = `${options.origin}/${options.path}`
    .replace('{path}', options[method] || '')
    .replace('{subdomain}', options.subdomain || '')
    .replace('{version}', options.version || '')
    .replace('{type}', options.type || '')

  return options

}
