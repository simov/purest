
var provider = {
  facebook: require('./facebook'),
  linkedin: require('./linkedin'),
  twitter: require('./twitter')
}

function Social (options) {
  if (!provider[options.provider]) {
    throw new Error('Non existing provider!')
  }
  return new provider[options.provider](options)
}

exports = module.exports = Social
