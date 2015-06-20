
var fs = require('fs')
  , path = require('path')
var Purest = require('../../../')
  , mime = require('mime-types').lookup


function Drive (options) {
  this.client = new Purest(options)
}

Drive.prototype.list = function (options, done) {
  this.client.query()
    .select('files')
    .auth(options.token)
    .request(done)
}

Drive.prototype.stats = function (options, done) {
  this.client.query()
    .select('files/'+options.id)
    .auth(options.token)
    .request(done)
}

Drive.prototype.upload = function (options, done) {
  return this.client.query('upload-drive')
    .update('files')
    .where({uploadType:'multipart'})
    .upload([
      {
        'Content-Type':'application/json',
        body:JSON.stringify({title:path.basename(options.path)})
      },
      {
        'Content-Type':mime(path.extname(options.path)),
        body:options.body||fs.createReadStream(options.path)
      }
    ])
    .auth(options.token)
    .request(done)
}

Drive.prototype.download = function (options, done) {
  return this.client.query()
    .get('files/'+options.id)
    .where({alt:'media'})
    .auth(options.token)
    .request(done)
}

exports = module.exports = Drive
