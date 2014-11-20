
var fs = require('fs')
var path = require('path')
var async = require('async')
var cred = {
  app:require('../../config/app'),
  user:require('../../config/user')
}
var fpath = path.resolve(__dirname,'../../test/fixtures/cat.png')


exports = module.exports = function (p) {
  return {
    0: function () {
      p.get('account/info', {
        auth: {bearer:cred.user.dropbox.token}
      }, function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
    },
    1: function () {
      p.put('files_put/auto/cat.png', {
        auth: {bearer:cred.user.dropbox.token},
        api: 'files',
        body: fs.readFileSync(fpath)
      }, function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
    },
    2: function () {
      p.get('files/auto/cat.png', {
        auth: {bearer:cred.user.dropbox.token},
        api: 'files'
      }, function (err, res, body) {
        debugger
        if (err) console.log(err)
        fs.writeFileSync('cat.png', body)
      })
    },
    3: function () {
      var upload_id = ''
      readFile(
        function (buffRead, bytesRead, next) {
          var options = {
            auth: {bearer:cred.user.dropbox.token},
            api: 'files',
            body: buffRead,
            qs: (!upload_id) ? undefined : {
              upload_id: upload_id,
              offset: bytesRead
            }
          }
          p.put('chunked_upload', options, function (err, res, body) {
            console.log('sent')
            debugger
            if (err) return console.log(err)
            if (!upload_id) upload_id = body.upload_id
            next()
          })
        },
        function (done) {
          p.post('commit_chunked_upload/auto/cat2.png', {
            auth: {bearer:cred.user.dropbox.token},
            api: 'files',
            qs: {upload_id:upload_id}
          }, function (err, res, body) {
            debugger
            if (err) console.log(err)
            console.log(body)
            // body.size.should.equal('21.5 KB')
            done()
          })
        }
      )
    }
  }
}

function readFile (next, done) {
  var fd = fs.openSync(fpath, 'r')
  var stats = fs.fstatSync(fd)

  var bufferSize = stats.size,
    chunkSize = 10000,//bytes
    buffer = new Buffer(bufferSize),
    bytesRead = 0
  var upload_id = ''

  async.whilst(
    function () {
      return bytesRead < bufferSize
    },
    function (done) {
      if ((bytesRead + chunkSize) > bufferSize) {
        chunkSize = (bufferSize - bytesRead)
      }
      // fd, buffer, offset, length, position, callback
      fs.read(fd, buffer, bytesRead, chunkSize, bytesRead,
      function (err, bytes, buff) {
        if (err) return done(err)

        var buffRead = buff.slice(bytesRead, bytesRead+chunkSize)

        next(buffRead, bytesRead, done)

        bytesRead += chunkSize
      })
    },
    function (err) {
      if (err) return console.log(err)
      done(function () {
        fs.close(fd)
      })
    }
  )
}
