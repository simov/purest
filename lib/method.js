
var def = require('../config/methods')

module.exports = (options) => {

  options.method = options.method ||
    Object.keys(options).find((key) => Object.keys(def.methods).includes(key))

  if (options.method) {
    options.method = options.method.toUpperCase()
  }

  return options

}
