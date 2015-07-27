'use strict'

function Url (provider) {
  this.provider = provider
}

Url.prototype.get = function (endpoint, options) {
  var api = options.api||this.provider.api||'__default'
    , config = this.provider.apis[api]
  if (!config) throw new Error('Purest: non existing API!')
  return [
    this.domain(config.domain, options),
    this.path(config, this.endpoint(endpoint, options), options)
  ].join('/')
}

Url.prototype.path = function (config, endpoint, options) {
  return config.path
    .replace('[path]', options.path||this.provider.path)
    .replace('[version]', options.version||this.provider.version||config.version)
    .replace('{endpoint}', endpoint)
    .replace('[type]', options.type||this.provider.type)
}

// overrides

Url.prototype.endpoint = function (endpoint, options) {
  return endpoint
}

Url.prototype.domain = function (domain, options) {
  if (domain.indexOf('[domain]') == -1) return domain

  var _domain = options.domain||this.provider.domain
  if (_domain) {
    delete options.domain
    return domain.replace('[domain]', _domain)
  }
  else {
    throw new Error('Purest: specify domain name to use through the domain option!')
  }
}


exports = module.exports = Url
