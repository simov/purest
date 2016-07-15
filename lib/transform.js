
module.exports = {

  oauth: (ctor, options) => {
    var oa = options.oauth || {}

    if (oa.consumer_key || ctor.key) {
      oa.consumer_key = oa.consumer_key || ctor.key
    }
    if (oa.consumer_secret || ctor.secret) {
      oa.consumer_secret = oa.consumer_secret || ctor.secret
    }

    if (oa.token) {
      oa.token = oa.token
    }
    if (oa.secret || oa.token_secret) {
      oa.token_secret = oa.secret || oa.token_secret
    }

    delete oa.secret

    // hackpad
    if (Object.keys(oa).length) {
      options.oauth = oa
    }
  },

  parse: (options) => {
    if (options.parse === undefined) {
      options.parse = {json: true}
    }
    else if (options.parse.json === undefined) {
      options.parse.json = true
    }
  },
  length: (options) => {
    if (options.length === undefined) {
      options.length = true
    }
  },

  callback: (callback) => (err, res, body) => {
    if (err) {
      callback(err, res, body)
      return
    }

    // request doesn't support JSONP parsing
    if (typeof body === 'string' && body.trim()) {
      var type = res.headers['content-type']
      var encoding = res.headers['content-encoding']

      if (/json|javascript/.test(type) || /json/.test(encoding)) {
        // JSONP
        if (/[^(]+\(([\s\S]+)\)/.test(body)) {
          try {
            body = JSON.parse(body.replace(/[^(]+\(([\s\S]+)\)/, '$1'))
          }
          catch (e) {
            callback(new Error('Purest: JSON parse error'), res, body)
            return
          }
        }
      }
    }

    if (res.statusCode >= 400 && res.statusCode < 600) {
      callback(body, res, body)
      return
    }

    callback(err, res, body)
  }
}
