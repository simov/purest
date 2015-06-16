
var extend = require('extend')


// initialize the apis data structure
exports.aliases = function (config) {
  var result = {}
  for (var domain in config) {
    if (domain == '__provider') continue
    for (var path in config[domain]) {
      if (path == '__domain') continue
      var options = config[domain][path]
      var alias = options.__path.alias
      alias = (alias instanceof Array) ? alias : [alias]
      for (var i=0; i < alias.length; i++) {
        result[alias[i]] = {
          domain: domain,
          path: path,
          version: options.__path.version,
          auth: options.__path.auth||(config[domain].__domain&&config[domain].__domain.auth),
          endpoints: this.endpoints(options)
        }
      }
    }
  }
  return result
}
// private
exports.endpoints = function (endpoints) {
  var result = {all:{}, str:{}, regex:{}}
  for (var key in endpoints) {
    if (key == '__path') continue
    if (key == '*') {
      result.all = endpoints[key]
    }
    else if (endpoints[key].__endpoint && endpoints[key].__endpoint.regex) {
      result.regex[key] = endpoints[key]
    }
    else {
      result.str[key] = endpoints[key]
    }
  }
  if (!Object.keys(result.all).length) result.all = null
  if (!Object.keys(result.str).length) result.str = null
  if (!Object.keys(result.regex).length) result.regex = null
  return result
}


// check for endpoint specific options
exports.options = function (endpoint, options, method, endpoints) {
  if (!endpoints.all && !endpoints.str && !endpoints.regex) return options

  var result = {}
  if (endpoints.all) {
    if (endpoints.all.all) {
      var config = endpoints.all.all
      extend(true, result, config, options)
    }
    if (endpoints.all[method]) {
      var config = endpoints.all[method]
      extend(true, result, config, options)
    }
  }
  if (endpoints.str && endpoints.str[endpoint]) {
    if (endpoints.str[endpoint][method]) {
      var config = endpoints.str[endpoint][method]
      extend(true, result, config, options)
    }
  }
  if (endpoints.regex) {
    for (var key in endpoints.regex) {
      if (new RegExp(key).test(endpoint)) {
        if (endpoints.regex[key][method]) {
          var config = endpoints.regex[key][method]
          extend(true, result, config, options)
          break
        }
      }
    }
  }
  return Object.keys(result).length ? result : options
}

// check for endpoint specific authentication
exports.auth = function (endpoint, endpoints) {
  if (!endpoints.all && !endpoints.str && !endpoints.regex) return null

  var result = null
  if (endpoints.all) {
    if (endpoints.all && endpoints.all.__endpoint) {
      if (endpoints.all.__endpoint.auth)
        result = endpoints.all.__endpoint.auth
    }
  }
  if (endpoints.str && endpoints.str[endpoint] && endpoints.str[endpoint].__endpoint) {
    if (endpoints.str[endpoint].__endpoint.auth)
      result = endpoints.str[endpoint].__endpoint.auth
  }
  if (endpoints.regex) {
    for (var key in endpoints.regex) {
      if (new RegExp(key).test(endpoint)) {
        if (endpoints.regex[key].__endpoint && endpoints.regex[key].__endpoint.auth) {
          result = endpoints.regex[key].__endpoint.auth
          break
        }
      }
    }
  }
  return result
}


// extend the configuration with custom provider
exports.extend = function (config, custom) {
  if (!custom) return
  extend(true, config, custom)
}
