
var fs = require('fs')
var path = require('path')
var Purest = require('../../lib/provider')
var providers = require('../../config/providers')
var image = path.resolve(__dirname, '../fixtures/cat.png')


describe('del', function () {
  function error (err, done) {
    return (err instanceof Error)
      ? done(err)
      : (console.log(err) || done(new Error('Network error!')))
  }

  require('../utils/credentials')
  var cred = {
    app:require('../../config/app'),
    user:require('../../config/user')
  }

  var p = {}
  before(function () {
    for (var name in providers) {
      var options = {
        provider:name,
        defaults:{headers:{'User-Agent':'Purest'}}
      }
      if (providers[name].__provider && providers[name].__provider.oauth) {
        options.key = cred.app[name].key
        options.secret = cred.app[name].secret
      }
      p[name] = new Purest(options)
    }
  })

  describe('box', function () {
    describe('request', function () {

    })
    describe('query', function () {
      var file = {}
      before(function (done) {
        p.box.post('files/content', {
          api:'upload',
          auth:{bearer:cred.user.box.token},
          qs:{parent_id:0},
          formData:{filename:fs.createReadStream(image)}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          file = body.entries[0]
          done()
        })
      })
      it('delete', function (done) {
        p.box.del('files/'+file.id, {
          auth:{bearer:cred.user.box.token}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          res.headers['content-location']
            .should.equal('https://api.box.com/api/2.0/files/'+file.id+'/trash')
          done()
        })
      })
    })
  })
})
