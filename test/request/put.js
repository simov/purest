
var fs = require('fs')
  , path = require('path')
var Purest = require('../../')
  , providers = require('../../config/providers')
var image = path.resolve(__dirname, '../fixtures/cat.png')


function error (err, done) {
  return (err instanceof Error)
    ? done(err)
    : (console.log(err) || done(new Error('Error reponse!')))
}

require('../utils/credentials')
var app = require('../../config/app')
  , user = require('../../config/user')

var p = {}
before(function () {
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
})


describe('dropbox', function () {
  describe('options', function () {
    it('upload', function (done) {
      p.dropbox.put('files_put/auto/cat.png', {
        auth: {bearer:user.dropbox.token},
        api: 'files',
        body: fs.readFileSync(image)
      }, function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.size.should.equal('21.5 KB')
        done()
      })
    })
    it('download', function (done) {
      p.dropbox.get('files/auto/cat.png', {
        auth: {bearer:user.dropbox.token},
        api: 'files'
      }, function (err, res, body) {
        debugger
        if (err) return error(err, done)
        var img = path.resolve(__dirname,'cat.png')
        fs.writeFileSync(img, body)
        fs.statSync(path.resolve(__dirname, '../fixtures/cat.png')).size
          .should.equal(fs.statSync(img).size)
        done()
      })
    })
    after(function () {
      fs.unlinkSync(path.resolve(__dirname,'cat.png'))
    })
  })
  describe('query', function () {
    it('upload', function (done) {
      p.dropbox.query('files')
        .create('files_put/auto/cat.png')
        .body(fs.readFileSync(image))
        .auth(user.dropbox.token)
        .request(function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.size.should.equal('21.5 KB')
          done()
        })
    })
    it('download', function (done) {
      p.dropbox.query('files')
        .get('files/auto/cat.png')
        .auth(user.dropbox.token)
        .request(function (err, res, body) {
          debugger
          if (err) return error(err, done)
          var img = path.resolve(__dirname,'cat.png')
          fs.writeFileSync(img, body)
          fs.statSync(path.resolve(__dirname, '../fixtures/cat.png')).size
            .should.equal(fs.statSync(img).size)
          done()
        })
    })
    after(function () {
      fs.unlinkSync(path.resolve(__dirname,'cat.png'))
    })
  })
})
