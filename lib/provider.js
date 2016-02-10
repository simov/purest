
module.exports = (options) => {
  var provider = {}

  provider.api = options.api

  provider.subdomain = options.subdomain
  provider.subpath = options.subpath
  provider.version = options.version
  provider.type = options.type

  if (options.key) {
    provider.key = options.key
  }
  if (options.secret) {
    provider.secret = options.secret
  }

  return provider
}
