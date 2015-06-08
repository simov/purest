
exports.response = function (cb) {
  return function (err, res, body) {
    if (!cb) return
    if (err) return cb(err, res, body)

    var encoding = res.headers['content-encoding']
    var type = res.headers['content-type']

    if ('string'===typeof body && body.trim() &&
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
