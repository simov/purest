
module.exports = (provider) => {

  function oauth (options) {
    var oa = options.oauth || {}

    if (oa.consumer_key || provider.key) {
      oa.consumer_key = oa.consumer_key || provider.key
    }
    if (oa.consumer_secret || provider.secret) {
      oa.consumer_secret = oa.consumer_secret || provider.secret
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
  }

  function parse (options) {
    if (options.parse === undefined) {
      options.parse = {json: true}
    }
    else if (options.parse.json === undefined) {
      options.parse.json = true
    }
  }

  function callback (callback) {
    return function (err, res, body) {
      if (err) {
        return callback(err, res, body)
      }

      // request doesn't support JSONP parsing
      if (typeof body === 'string' && body.trim()) {
        var type = res.headers['content-type']
        var encoding = res.headers['content-encoding']

        if (/json|javascript/.test(type) || /json/.test(encoding)) {
          // jsonp
          if (/[^(]+\(([\s\S]+)\)/.test(body)) {
            body = body.replace(/[^(]+\(([\s\S]+)\)/, '$1')
          }
          try {
            body = JSON.parse(body)
          }
          catch (e) {
            return callback(new Error('JSONP parse error!'), res, body)
          }
        }
      }

      if (res.statusCode >= 400 && res.statusCode < 600) {
        return callback(body, res, body)
      }

      callback(err, res, body)
    }
  }

  return {oauth, parse, callback}
}
