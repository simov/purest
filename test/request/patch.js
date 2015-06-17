
var fs = require('fs')
var path = require('path')
var Purest = require('../../')
var providers = require('../../config/providers')
var image = path.resolve(__dirname, '../fixtures/cat.png')


describe('patch', function () {
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

  describe('salesforce', function () {
    describe('request', function () {

    })
    describe('query', function () {
      var id = ''
      before(function (done) {
        // POST
        p.salesforce.query('sobjects')
          .post('Lead')
          .options({domain:cred.user.salesforce.domain})
          .json({
            email:'purest@mailinator.com',
            FirstName:'Unkown', LastName:'Unknown', Company:'Unknown'
          })
          .auth(cred.user.salesforce.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.success.should.equal(true)
            id = body.id
            done()
          })
      })
      it('patch', function (done) {
        p.salesforce.query('sobjects')
          .patch('Lead/'+id)
          .options({domain:cred.user.salesforce.domain})
          .json({FirstName:'First', LastName:'Last'})
          .auth(cred.user.salesforce.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)

            // GET
            p.salesforce.query('sobjects')
              .get('Lead/'+id)
              .options({domain:cred.user.salesforce.domain})
              .auth(cred.user.salesforce.token)
              .request(function (err, res, body) {
                debugger
                if (err) return error(err, done)
                body.FirstName.should.equal('First')
                body.LastName.should.equal('Last')
                done()
              })
          })
      })
      after(function (done) {
        // DELETE
        p.salesforce.query('sobjects')
          .del('Lead/'+id)
          .options({domain:cred.user.salesforce.domain})
          .auth(cred.user.salesforce.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            done()
          })
      })
    })
  })
})
