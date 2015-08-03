'use strict'

function Url (provider) {
  this.provider = provider
}

Url.prototype.get = function (endpoint, options, config) {
  return [
    this.domain(options, config),
    this.path(endpoint, options, config)
  ].join('/')
}

Url.prototype.domain = function (options, config) {
  if (config.domain.indexOf('[subdomain]') == -1) return config.domain

  var sub = options.subdomain||this.provider.subdomain||config.subdomain||''
  if (sub != undefined) {
    delete options.subdomain
    return config.domain.replace('[subdomain]', sub)
  }
}

Url.prototype.path = function (endpoint, options, config) {
  return config.path
    .replace('[subpath]', options.subpath||this.provider.subpath||config.subpath||'')
    .replace('[version]', options.version||this.provider.version||config.version||'')
    .replace('{endpoint}', endpoint||config.endpoint||'')
    .replace('[type]', options.type||this.provider.type||config.type||'json')
}


exports = module.exports = Url
