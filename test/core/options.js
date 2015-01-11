
var should = require('should')
var Purest = require('../../lib/provider')
var Options = require('../../lib/options')
var config = require('../../lib/config')


describe('options', function () {

  describe('oauth', function () {
    it('throw error on missing credentials', function () {
      ;(function () {
        var p = new Purest({provider:'twitter', secret:'s'})
        p.options.oauth({token:'t', secret:'ts'})
      }).should.throw('Purest: Missing OAuth credentials!')
      ;(function () {
        var p = new Purest({provider:'twitter', key:'k'})
        p.options.oauth({token:'t', secret:'ts'})
      }).should.throw('Purest: Missing OAuth credentials!')
      ;(function () {
        var p = new Purest({provider:'twitter', key:'k', secret:'s'})
        p.options.oauth({secret:'ts'})
      }).should.throw('Purest: Missing OAuth credentials!')
      ;(function () {
        var p = new Purest({provider:'twitter', key:'k', secret:'s'})
        p.options.oauth({token:'ts'})
      }).should.throw('Purest: Missing OAuth credentials!')
    })
    it('use consumer key/secret provided from the ctor', function () {
      var p = new Purest({provider:'twitter', key:'k', secret:'s'}),
        options = {oauth:{token:'t', secret:'ts'}}
      p.options.oauth(options)
      options.oauth.consumer_key.should.equal('k')
      options.oauth.consumer_secret.should.equal('s')
    })
    it('use consumer key/secret provided as parameters', function () {
      var p = new Purest({provider:'twitter', key:'k', secret:'s'}),
        options = {oauth:{consumer_key:'ck', consumer_secret:'cs', token:'t', secret:'s'}}
      p.options.oauth(options)
      options.oauth.consumer_key.should.equal('ck')
      options.oauth.consumer_secret.should.equal('cs')
    })
    it('set user token/secret', function () {
      var p = new Purest({provider:'twitter', key:'k', secret:'s'}),
        options = {oauth:{token:'t', token_secret:'ts'}}
      p.options.oauth(options)
      options.oauth.token.should.equal('t')
      options.oauth.token_secret.should.equal('ts')
    })
    it('set user token/secret through token_secret shortcut', function () {
      var p = new Purest({provider:'twitter', key:'k', secret:'s'}),
        options = {oauth:{token:'t', secret:'ts'}}
      p.options.oauth(options)
      options.oauth.token.should.equal('t')
      options.oauth.token_secret.should.equal('ts')
    })
  })
})
