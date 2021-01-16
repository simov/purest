
var def = require('../config/methods')

module.exports = (options) => {

  if (options.url) {
    return options
  }

  var url = `${options.domain}/${options.path}`

  var method = Object.keys(options)
    .find((key) => Object.keys(def.methods).includes(key))

  url = url
    .replace('{path}', options[method] || '')
    .replace('{subdomain}', options.subdomain || '')
    .replace('{version}', options.version || '')
    .replace('{type}', options.type || '')

  options.url = url

  return options

}
