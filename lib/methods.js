
var extend = require('extend')


module.exports = (options) => {
  var methods = {
    method: {
      get      : ['select'],
      post     : [],
      put      : [],
      patch    : [],
      head     : [],
      trace    : [],
      options  : [],
      delete   : []
    },
    option: {
      qs       : ['where'],
      form     : [],
      json     : [],
      body     : [],
      multipart: [],
      auth     : [],
      oauth    : [],
      headers  : [],
      gzip     : [],
      encoding : [],
      cookie   : [],
      length   : [],
      redirect : [],
      timeout  : [],
      proxy    : [],
      tunnel   : [],
      parse    : [],
      stringify: [],
      callback : [],
      end      : []
    },
    custom: {
      api      : ['query'],
      auth     : [],
      submit   : []
    }
  }

  if (options.methods) {
    extend(true, methods, options.methods)
  }

  return methods
}
