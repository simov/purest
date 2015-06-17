
if (!process.argv[2]) return console.log('Specify example to run')

var fs = require('fs')
  , path = require('path')
  , async = require('async')

var app = require('../../config/app').dropbox || {}
  , user = require('../../config/user').dropbox || {}
var p = new (require('../../'))({provider:'dropbox'})

var fpath = path.resolve(__dirname,'../../test/fixtures/cat.png')


var examples = {
  // get account info
  0: function () {
    p.query()
      .get('account/info')
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // upload a file
  1: function () {
    p.query('files')
      .create('files_put/auto/cat.png')
      .body(fs.readFileSync(fpath))
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // download a file
  2: function () {
    p.query('files')
      .get('files/auto/cat.png')
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        fs.writeFileSync('cat.png', body)
      })
  },
  // upload file by chunks - see readFile function below
  3: function () {
    var upload_id = ''
    readFile(
      function (buffRead, bytesRead, next) {
        p.query('files')
          .create('chunked_upload')
          .where((!upload_id) ? undefined : {
            upload_id: upload_id,
            offset: bytesRead
          })
          .body(buffRead)
          .auth(user.token)
          .request(function (err, res, body) {
            console.log('sent')
            debugger
            if (err) return console.log(err)
            if (!upload_id) upload_id = body.upload_id
            next()
          })
      },
      function (done) {
        p.query('files')
          .post('commit_chunked_upload/auto/cat2.png')
          .where({upload_id:upload_id})
          .auth(user.token)
          .request(function (err, res, body) {
            debugger
            if (err) console.log(err)
            console.log(body)
            // body.size.should.equal('21.5 KB')
            done()
          })
      }
    )

    function readFile (next, done) {
      var fd = fs.openSync(fpath, 'r')
        , stats = fs.fstatSync(fd)

      var bufferSize = stats.size
        , chunkSize = 10000 // bytes
        , buffer = new Buffer(bufferSize)
        , bytesRead = 0
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
  }
}

examples[process.argv[2]]()
