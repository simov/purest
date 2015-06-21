
var Purest = require('../../../')


function SendGrid (options) {
  this.purest = new Purest(options)
}

SendGrid.prototype.send = function (args, done) {
  args.to = (args.to instanceof Array) ? args.to : [args.to]
  args.cc = (args.cc instanceof Array) ? args.cc : [args.cc]
  args.bcc = (args.bcc instanceof Array) ? args.bcc : [args.bcc]

  var email = {
    from:args.from.email,
    fromname:args.from.name,

    to:     args.to.map(function (item) {return item.email}),
    toname: args.to.map(function (item) {return item.name}),
    cc:     args.cc.map(function (item) {return item.email}),
    ccname: args.cc.map(function (item) {return item.name}),
    bcc:    args.bcc.map(function (item) {return item.email}),
    bccname:args.bcc.map(function (item) {return item.name}),

    subject:args.subject,
    html:args.html,
    text:args.text
  }

  // 'files[cat.png]':fs.createReadStream(image),
  // 'files[beep.mp3]':fs.createReadStream(audio)
  args.attachments.forEach(function (item) {
    email['files['+item.name+']'] = item.data
  })

  this.purest.query()
    .post('mail.send')
    .upload(email)
    .auth(args.auth.user, args.auth.pass)
    .request(done)
}

exports = module.exports = SendGrid
