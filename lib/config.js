'use strict'

var extend = require('extend')


// initialize the apis data structure
exports.aliases = function (provider) {
  var result = {}
  for (var domain in provider) {
    if (domain == '__provider') continue

    for (var path in provider[domain]) {
      if (path == '__domain') continue

      var options = provider[domain][path]
      if (!options.__path) {
        throw new Error('Purest: __path key is required!')
      }
      if (!options.__path.alias) {
        throw new Error('Purest: __path.alias key is required!')
      }
      var alias = options.__path.alias
      alias = (alias instanceof Array) ? alias : [alias]

      for (var i=0; i < alias.length; i++) {
        result[alias[i]] = {
          domain: domain,
          path: path,

          subdomain: options.__path.subdomain
            || (provider[domain].__domain && provider[domain].__domain.subdomain)
            || null,

          subpath: options.__path.subpath || null,
          version: options.__path.version || null,
          endpoint: options.__path.endpoint || null,
          type: options.__path.type || null,

          auth: options.__path.auth
            || (provider[domain].__domain && provider[domain].__domain.auth)
            || null,

          endpoints: this.endpoints(options)
        }
      }
    }
  }
  if (Object.keys(result).length) {
    return result
  }
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

  function check (config) {
    if (config.all) {
      extend(true, result, config.all, options)
    }
    if (config[method]) {
      extend(true, result, config[method], options)
    }
  }

  // all
  if (endpoints.all) {
    check(endpoints.all)
  }
  // string
  if (endpoints.str && endpoints.str[endpoint]) {
    check(endpoints.str[endpoint])
  }
  // regex
  if (endpoints.regex) {
    for (var key in endpoints.regex) {
      if (new RegExp(key).test(endpoint)) {
        var config = endpoints.regex[key]
        if (config.all || config[method]) {
          check(config)
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
    if (endpoints.all.__endpoint && endpoints.all.__endpoint.auth) {
      result = endpoints.all.__endpoint.auth
    }
  }
  if (endpoints.str && endpoints.str[endpoint]) {
    if (endpoints.str[endpoint].__endpoint && endpoints.str[endpoint].__endpoint.auth)
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
