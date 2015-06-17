
if (!process.argv[2]) return console.log('Specify example to run')

var app = require('../../config/app').pipelinedeals || {}
  , user = require('../../config/user').pipelinedeals || {}
var p = new (require('../../'))({provider:'pipelinedeals'})


var examples = {
  0: function () {
    p.query()
      .select('companies')
      .auth(user.apikey)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  1: function () {
    p.query()
      .update('companies')
      .set({company:{name:'Purest'}})
      .auth(user.apikey)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  2: function () {
    p.query()
      .put('companies/:id')
      .set({company:{address_1:'Outofindex'}})
      .auth(user.apikey)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  3: function () {
    p.query()
      .del('companies/:id')
      .auth(user.apikey)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  }
}

examples[process.argv[2]]()
