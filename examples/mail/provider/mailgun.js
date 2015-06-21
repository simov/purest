
var Purest = require('../../../')


function MailGun (options) {
  this.purest = new Purest(options)
}

MailGun.prototype.send = function (args, done) {
  args.to = (args.to instanceof Array) ? args.to : [args.to]
  args.cc = (args.cc instanceof Array) ? args.cc : [args.cc]
  args.bcc = (args.bcc instanceof Array) ? args.bcc : [args.bcc]

  function recipient (item) {
    return item.name
      ? item.name + ' ' + '<' + item.email + '>'
      : item.email
  }

  var email = {
    from:recipient(args.from),
    to:args.to.map(function (item) {
      return recipient(item)
    }).join(),
    cc:args.cc.map(function (item) {
      return recipient(item)
    }).join(),
    bcc:args.bcc.map(function (item) {
      return recipient(item)
    }).join(),

    subject:args.subject,
    html:args.html,
    text:args.text,

    // [fs.createReadStream(image), fs.createReadStream(audio)]
    attachment:args.attachments.map(function (item) {
      return item.data
    })
  }

  this.purest.query()
    .post(args.auth.domain + '/messages')
    .upload(email)
    .auth('api', args.auth.apikey)
    .request(done)
}

exports = module.exports = MailGun
