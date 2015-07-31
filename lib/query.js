'use strict'

var extend = require('extend')
var config = require('./config')
var query = require('../config/query')


function Query (provider, aliases) {
  this.provider = provider

  initAliases.call(this, query)
  if (aliases) {
    initAliases.call(this, aliases)
  }
}

function initAliases (config) {
  var self = this
  if (config.verbs) {
    Object.keys(config.verbs).forEach(function (verb) {
      config.verbs[verb].forEach(function (alias) {
        self[alias] = wrapVerb(verb)
      })
    })
  }
  if (config.options) {
    Object.keys(config.options).forEach(function (option) {
      config.options[option].forEach(function (alias) {
        self[alias] = wrapOption(option)
      })
    })
  }
  if (config.custom) {
    if (config.custom.auth) {
      config.custom.auth.forEach(function (alias) {
        self[alias] = Query.prototype.authCustom
      })
    }
    if (config.custom.request) {
      config.custom.request.forEach(function (alias) {
        self[alias] = Query.prototype.request
      })
    }
  }
  this.upload = upload
}

Query.prototype._init = function (name) {
  this.method = ''
  this.endpoint = ''
  this._options = {api:name||this.provider.api}
  this.api = this.provider.apis[name||this.provider.api]
}

// http

function wrapVerb (verb) {
  if (verb == 'delete') verb = 'del'
  return function (endpoint) {
    this.method = verb
    this.endpoint = endpoint
    return this
  }
}

Object.keys(query.verbs).forEach(function (verb) {
  var method = (verb == 'options')
    ? 'optionsVerb'
    : verb
  Query.prototype[method] = wrapVerb(verb)
})

// options

function wrapOption (option) {
  return (option == 'options')
    ? function (options) {
        extend(true, this._options, options)
        return this
      }
    : function (options) {
        var obj = {}
        obj[option] = options
        extend(true, this._options, obj)
        return this
      }
}

Object.keys(query.options).forEach(function (option) {
  var method
  if (option == 'options') {method = 'optionsRequest'}
  else if (option == 'auth') {method = 'optionsAuth'}
  else {method = option}
  Query.prototype[method] = wrapOption(option)
})

// duplicate methods

Query.prototype.options = function (param) {
  return (typeof param === 'string')
    // HTTP OPTIONS
    ? this.optionsVerb(param)
    // request options
    : this.optionsRequest(param)
}

Query.prototype.auth = function () {
  return (typeof arguments[0] === 'string')
    // custom auth method
    ? this.authCustom.apply(this, arguments)
    // request auth options
    : this.optionsAuth(arguments[0])
}

function upload (options) {
  return (options instanceof Array)
    ? this.multipart(options)
    : this.formData(options)
}

// custom

// authentication

function dcopy (target, values) {
  var copy = {}, index = 0
  ;(function read (target, copy) {
    for (var key in target) {
      var obj = target[key]
      if (obj instanceof Object) {
        var value = {}
          , last = add(copy, key, value)
        read(obj, last)
      } else {
        var value = obj
        add(copy, key, value.replace('['+index+']',values[index]))
        index++
      }
    }
  }(target, copy))
  return copy
}
function add (copy, key, value) {
  if (copy instanceof Object) {
    copy[key] = value
    return copy[key]
  }
}

Query.prototype.authCustom = function () {
  var auth = config.auth(this.endpoint, this.api.endpoints)||this.api.auth
  if (!auth) return this

  var options = (auth instanceof Array)
    ? auth[arguments.length-1]
    : auth

  var result = dcopy(options, arguments)
  extend(true, this._options, result)
  return this
}

// request

Query.prototype.request = function (callback) {
  return this.provider[this.method](this.endpoint, this._options, callback)
}


exports = module.exports = Query
