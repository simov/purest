
function Url (provider) {
    this.provider = provider;
}

Url.prototype.get = function (endpoint, options) {
    var config = this.provider;

    var api = options.api||config.api;
    if (api) {
        if ('string'===typeof api) {
            api = config.apis[api];
            if (!api) throw new Error('Purest: non existing API!');
            return [
                this.domain(api.domain, options),
                this.path(api, this.endpoint(endpoint, options), null)
            ].join('/')+this.qs(endpoint, options);
        }
        else {
            api = config.apis[api.name];
            if (!api) throw new Error('Purest: non existing API!');
            return [
                this.domain(options.api.domain||api.domain, options),
                this.path(api, this.endpoint(endpoint, options), options.api)
            ].join('/')+this.qs(endpoint, options);
        }
    }
    else {
        return [
            this.domain(config.domain, options),
            this.path(config, this.endpoint(endpoint, options), options.provider)
        ].join('/')+this.qs(endpoint, options);
    }
}

Url.prototype.path = function (config, endpoint, options) {
    if (!options) {
        return config.format
            .replace('path', config.path)
            .replace('version', config.version)
            .replace('endpoint', endpoint)
            .replace('type', config.type||'json');
    }
    else {
        return config.format
            .replace('path', options.path||config.path)
            .replace('version', options.version||config.version)
            .replace('endpoint', endpoint)
            .replace('type', options.type||config.type||'json');
    }
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
