
var provider = {
  facebook: require('./provider/facebook'),
  linkedin: require('./provider/linkedin'),
  twitter: require('./provider/twitter')
}

function Social (options) {
  if (!provider[options.provider]) {
    throw new Error('Non existing provider!')
  }
  return new provider[options.provider](options)
}

exports = module.exports = Social
