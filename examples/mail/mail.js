
var provider = {
  sendgrid: require('./provider/sendgrid'),
  mandrill: require('./provider/mandrill'),
  mailgun: require('./provider/mailgun')
}

function Mail (options) {
  if (!provider[options.provider]) {
    throw new Error('Non existing provider!')
  }
  return new provider[options.provider](options)
}

exports = module.exports = Mail
