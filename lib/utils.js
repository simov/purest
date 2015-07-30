'use strict'

exports.oauth = function (options) {
  var oa = options.oauth||{}

  if (oa.consumer_key||this.key) {
    oa.consumer_key = oa.consumer_key||this.key
  }
  if (oa.consumer_secret||this.secret) {
    oa.consumer_secret = oa.consumer_secret||this.secret
  }

  if (oa.token) {
    oa.token = oa.token
  }
  if (oa.secret||oa.token_secret) {
    oa.token_secret = oa.secret||oa.token_secret
  }

  delete oa.secret

  // hackpad
  if (Object.keys(oa).length) {
    options.oauth = oa
  }
}

exports.response = function (cb) {
  return function (err, res, body) {
    if (!cb) return null
    if (err) return cb(err, res, body)

    var encoding = res.headers['content-encoding']
      , type = res.headers['content-type']

    if (typeof body === 'string' && body.trim() &&
      (/json/.test(encoding) || /json|javascript/.test(type))) {
      // jsonp
      if (/[^(]+\(([\s\S]+)\)/.test(body)) {
        body = body.replace(/[^(]+\(([\s\S]+)\)/, '$1')
      }
      try {
        body = JSON.parse(body)
      }
      catch (e) {
        return cb(new Error('JSON parse error!'), res, body)
      }
    }

    if ([200, 201, 202, 301, 302].indexOf(res.statusCode) == -1) {
      return cb(body, res, body)
    }

    cb(err, res, body)
  }
}
