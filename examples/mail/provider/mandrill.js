
var Purest = require('purest')
  , mime = require('mime-types').lookup


function Mandrill (options) {
  this.purest = new Purest(options)
}

// https://mandrillapp.com/api/docs/messages.JSON.html#method=send

Mandrill.prototype.send = function (args, done) {
  args.to = (args.to instanceof Array) ? args.to : [args.to]
  args.cc = (args.cc instanceof Array) ? args.cc : [args.cc]
  args.bcc = (args.bcc instanceof Array) ? args.bcc : [args.bcc]

  var email = {
    message: {
      from_email:args.from.email,
      from_name:args.from.name,

      to:args.to.map(function (item) {
        item.type = 'to'
        return item
      }).concat(args.cc.map(function (item) {
        item.type = 'cc'
        return item
      }))
      .concat(args.bcc.map(function (item) {
        item.type = 'bcc'
        return item
      })),

      subject:args.subject,
      html:args.html,
      text:args.text,

      attachments:args.attachments.map(function (item) {
        return {
          name:item.name,
          // image/png
          type:mime(item.name),
          // fs.readFileSync(image)
          content:item.data.toString('base64')
        }
      })
    }
  }

  // uses base64 instead of multipart
  this.purest.query()
    .post('messages/send')
    .set(email)
    .auth(args.auth.apikey)
    .request(done)
}

exports = module.exports = Mandrill
