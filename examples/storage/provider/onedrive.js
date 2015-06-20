
var fs = require('fs')
  , path = require('path')
var Purest = require('../../../')


function OneDrive (options) {
  this.client = new Purest(options)
}

OneDrive.prototype.list = function (options, done) {
  this.client.query()
    .select(options.id+'/skydrive/files')
    .auth(options.token)
    .request(done)
}

OneDrive.prototype.stats = function (options, done) {
  this.client.query()
    .select(options.id)
    .auth(options.token)
    .request(done)
}

OneDrive.prototype.upload = function (options, done) {
  var name = options.name||path.basename(options.path)

  var request = this.client.query()
    .put('me/skydrive/files/'+name)
    .headers({'content-type':'application/json'})
    .auth(options.token)
    .request(done)

  return (options.name)
    ? request
    : fs.createReadStream(options.path).pipe(request)
}

OneDrive.prototype.download = function (options, done) {
  return this.client.query()
    .get(options.id+'/content')
    .auth(options.token)
    .request(done)
}

exports = module.exports = OneDrive
