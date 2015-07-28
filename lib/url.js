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

Url.prototype.domain = function (domain, options) {
  if (domain.indexOf('[subdomain]') == -1) return domain

  var _domain = options.subdomain||this.provider.subdomain
  if (_domain) {
    delete options.subdomain
    return domain.replace('[subdomain]', _domain)
  }
  else {
    throw new Error(
      'Purest: specify subdomain name to use through the subdomain option!')
  }
}

Url.prototype.path = function (config, endpoint, options) {
  return config.path
    .replace('[path]', options.path||this.provider.path||config.path||'')
    .replace('[version]', options.version||this.provider.version||config.version||'')
    .replace('{endpoint}', endpoint||config.endpoint||'')
    .replace('[type]', options.type||this.provider.type||config.type||'json')
}

Url.prototype.endpoint = function (endpoint, options) {
  return endpoint
}


exports = module.exports = Url
