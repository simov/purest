
var fs = require('fs')
  , path = require('path')
var Purest = require('../../../')


function Box (options) {
  this.client = new Purest(options)
}

Box.prototype.list = function (options, done) {
  this.client.query()
    .select('folders/'+options.id+'/items')
    .auth(options.token)
    .request(done)
}

Box.prototype.stats = function (options, done) {
  var api = (options.type == 'file') ? 'files' : 'folders'
  this.client.query()
    .select(api+'/'+options.id)
    .auth(options.token)
    .request(done)
}

Box.prototype.upload = function (options, done) {
  return this.client.query('upload')
    .update('files/content')
    .where({parent_id:0})
    .upload({filename:options.body||fs.createReadStream(options.path)})
    .auth(options.token)
    .request(done)
}

Box.prototype.download = function (options, done) {
  return this.client.query()
    .get('files/'+options.id+'/content')
    .auth(options.token)
    .request(done)
}

exports = module.exports = Box
