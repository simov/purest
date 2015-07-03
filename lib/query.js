
var extend = require('extend')
var config = require('./config')
var query = require('../config/query')


function Query (provider, name) {
  this.provider = provider

  this.method = ''
  this.endpoint = ''
  this._options = {api:name||this.provider.api}
  this.api = this.provider.apis[name||this.provider.api]
}

exports = module.exports = Query

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
  if (verb == 'options') {method = 'optionsVerb'}
  else {method = verb}
  Query.prototype[method] = wrapVerb(verb)
  query.verbs[verb].forEach(function (alias) {
    Query.prototype[alias] = wrapVerb(verb)
  })
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
  if (option == 'options') {method = 'optionsRequest'}
  else if (option == 'auth') {method = 'optionsAuth'}
  else {method = option}
  Query.prototype[method] = wrapOption(option)
  query.options[option].forEach(function (alias) {
    Query.prototype[alias] = wrapOption(option)
  })
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

Query.prototype.upload = function (options) {
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

query.custom.auth.forEach(function (alias) {
  Query.prototype[alias] = Query.prototype.authCustom
})

// request

Query.prototype.request = function (callback) {
  return this.provider[this.method](this.endpoint, this._options, callback)
}

query.custom.request.forEach(function (alias) {
  Query.prototype[alias] = Query.prototype.request
})
