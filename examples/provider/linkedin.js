
if (!process.argv[2]) return console.log('Specify example to run')
var id = process.argv[3]

var app = require('../../config/app').linkedin || {}
  , user = require('../../config/user').linkedin || {}
var p = new (require('../../lib/provider'))({provider:'linkedin',
  key:app.key, secret:app.secret,
  /*defaults:{oauth:{token:user.token, token_secret:user.secret}},*/})


var examples = {
  // get account profile
  0: function () {
    var fields = ':(id,first-name,last-name,formatted-name,headline,'+
      'picture-url,auth-token,distance,num-connections)'
    p.query()
      .select('people/~' + fields)
      .auth(user.token, user.secret)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get company page profile
  1: function () {
    var fields = ':(id,name,universal-name,logo-url,square-logo-url,num-followers)'
    p.query()
      .select('companies/' + id + fields)
      .auth(user.token, user.secret)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get group profile
  2: function () {
    var fields = ':(id,name,num-members,small-logo-url,large-logo-url)'
    p.query()
      .select('groups/' + id + fields)
      .auth(user.token, user.secret)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // list company pages
  3: function () {
    var fields = ':(id,name,universal-name,logo-url,square-logo-url)'
    p.query()
      .select('companies' + fields)
      .where({'is-company-admin':true})
      .auth(user.token, user.secret)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // list groups
  4: function () {
    var fields = ':(group:(id,name,num-members,small-logo-url,large-logo-url))'
    p.query()
      .select('people/~/group-memberships' + fields)
      .where({
        // 'membership-state':'owner',
        // 'membership-state':'manager',
        // 'membership-state':'member',
        count:25
      })
      .auth(user.token, user.secret)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get user's updates
  5: function () {
    var fields = ':(timestamp,update-key,update-type,update-content'+
      ':(person:(id,first-name,last-name,formatted-name,headline,picture-url,'+
      'auth-token,distance,connections,current-share,main-address,'+
      'twitter-accounts,im-accounts,phone-numbers,date-of-birth,member-groups)),'+
      'updated-fields,is-commentable,update-comments,is-likable,is-liked,num-likes)'
    p.query()
      .select('people/' + (id||'~') + '/network/updates' + fields)
      .where({
        type:'SHAR',
        scope:'self',
        count:25
      })
      .auth(user.token, user.secret)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get user's first-degree connection updates
  6: function () {
    var fields = ':(timestamp,update-key,update-type,update-content'+
      ':(person:(id,first-name,last-name,formatted-name,headline,picture-url,'+
      'auth-token,distance,connections,current-share,main-address,'+
      'twitter-accounts,im-accounts,phone-numbers,date-of-birth,member-groups)),'+
      'updated-fields,is-commentable,update-comments,is-likable,is-liked,num-likes)'
    p.query()
      .select('people/' + (id||'~') + '/network/updates' + fields)
      .where({
        type:'SHAR',
        count:25
      })
      .auth(user.token, user.secret)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get company page updates
  7: function () {
    var fields = ':(timestamp,updateType,updateContent,updateKey,isCommentable,'+
      'likes,updateComments)'
    p.query()
      .select('companies/' + id + '/updates' + fields)
      .where({
        'event-type':'status-update',
        start:0,
        count:5
      })
      .auth(user.token, user.secret)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get group updates
  8: function () {
    p.query()
      .select('groups/' + id + '/posts')
      .where({count:5})
      .auth(user.token, user.secret)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get group updates that the token user created
  9: function () {
    p.query()
      .select('people/~/group-memberships/' + id + '/posts')
      .where({role:'creator', count:5, order:'recency'})
      .auth(user.token, user.secret)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // post user share
  10: function () {
    p.query()
      .update('people/~/shares')
      .set({
        comment:'Publish message on ' + new Date(),
        visibility:{code:'anyone'}
      })
      .auth(user.token, user.secret)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // post company page share
  11: function () {
    p.query()
      .update('companies/' + id + '/shares')
      .set({
        comment:'Publish message on ' + new Date(),
        visibility:{code:'anyone'}
      })
      .auth(user.token, user.secret)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // post group share
  12: function () {
    p.query()
      .update('groups/' + id + '/posts')
      .set({
        title:'Publish message on ' + new Date(),
        summary:' '
      })
      .auth(user.token, user.secret)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  }
}

examples[process.argv[2]]()
