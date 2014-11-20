
var cred = {
  app:require('../../config/app'),
  user:require('../../config/user')
}


exports = module.exports = function (p) {
  return {
    0: function () {
      p.get('companies', {
        qs:{api_key:cred.user.pipelinedeals.apikey}
      }, function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
    },
    1: function () {
      p.post('companies', {
        form:{
          api_key:cred.user.pipelinedeals.apikey,
          company:{name:'Purest'}
        }
      }, function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
    },
    2: function () {
      p.put('companies/:id', {
        form:{
          api_key:cred.user.pipelinedeals.apikey,
          company:{address_1:'Outofindex'}
        }
      }, function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
    },
    3: function () {
      p.del('companies/:id', {
        form:{api_key:cred.user.pipelinedeals.apikey}
      }, function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
    }
  }
}
