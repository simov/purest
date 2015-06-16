
var provider = {
  sendgrid: require('./sendgrid'),
  mandrill: require('./mandrill'),
  mailgun: require('./mailgun')
}

function Mail (options) {
  if (!provider[options.provider]) {
    throw new Error('Non existing provider!')
  }
  return new provider[options.provider](options)
}

exports = module.exports = Mail
