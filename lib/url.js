
function Url (provider) {
    this.provider = provider;
}

Url.prototype.get = function (endpoint, options) {
    var api = options.api||this.provider.api||'__default';
    var config = this.provider.apis[api];
    if (!config) throw new Error('Purest: non existing API!');
    return [
        this.domain(config.domain, options),
        this.path(config, this.endpoint(endpoint, options), options)
    ].join('/')+this.qs(endpoint, options);
}

Url.prototype.path = function (config, endpoint, options) {
    return config.path
        .replace('[version]', options.version||config.version)
        .replace('{endpoint}', endpoint)
        .replace('[type]', options.type||this.provider.type||'json');
}

// overrides

Url.prototype.endpoint = function (endpoint, options) {
    return endpoint;
}

Url.prototype.domain = function (domain, options) {
    return domain;
}

Url.prototype.qs = function (endpoint, options) {
    return '';
}


exports = module.exports = Url;
