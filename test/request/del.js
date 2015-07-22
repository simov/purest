
var fs = require('fs')
  , path = require('path')
var Purest = require('../../')
  , providers = require('../../config/providers')
var image = path.resolve(__dirname, '../fixtures/cat.png')


function error (err, done) {
  return (err instanceof Error)
    ? done(err)
    : (console.log(err) || done(new Error('Error response!')))
}

require('../utils/credentials')
var app = require('../../config/app')
  , user = require('../../config/user')

var p = {}
for (var name in providers) {
  var options = {
    provider:name,
    defaults:{headers:{'User-Agent':'Purest'}}
  }
  if (providers[name].__provider && providers[name].__provider.oauth) {
    options.key = app[name].key
    options.secret = app[name].secret
  }
  p[name] = new Purest(options)
}


describe('box', function () {
  var file = {}
  before(function (done) {
    p.box.post('files/content', {
      api:'upload',
      auth:{bearer:user.box.token},
      qs:{parent_id:0},
      formData:{filename:fs.createReadStream(image)}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      file = body.entries[0]
      done()
    })
  })
  it('query', function (done) {
    p.box.del('files/'+file.id, {
      auth:{bearer:user.box.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      res.headers['content-location']
        .should.equal('https://api.box.com/api/2.0/files/'+file.id+'/trash')
      done()
    })
  })
})
