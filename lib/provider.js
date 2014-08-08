
var request = require('request');

var utils = require('./utils'),
    Options = require('./options');

var c = {
    providers: require('../config/providers'),
    options: require('./provider/index')
};


function Provider (options) {
    if (!options || !options.provider)
        throw new Error('purest: provider option is required!');
    if (!c.providers[options.provider]) {
        throw new Error('purest: non existing provider!');
    }

    this.options = new Options();
    
    if (c.options.indexOf(options.provider) != -1) {
        var provider = require('./provider/'+options.provider);
        provider.call(this);
    }

    this.consumerKey = options.consumerKey||options.key||null;
    this.consumerSecret = options.consumerSecret||options.secret||null;

    this.api = options.api||'';
    this.version = options.version||c.providers[options.provider].version||'';
    this.domain = options.domain||c.providers[options.provider].domain||'';
    this.apis = c.providers[options.provider].api||null;

    this.name = options.provider;
    this[options.provider] = true;
}

Provider.prototype.createPath = function (api, options) {
    options = options||{};
    var version = options.version||this.version;
    switch (true) {
        // v1/endpoint.json
        case this.twitter:
            return [version, api+'.json'].join('/');
        // v1/endpoint
        case this.bitly: case this.linkedin: case this.stackexchange:
        case this.gmaps: case this.foursquare: case this.instagram:
            return [version, api].join('/');
        
        // api/v1/endpoint.json
        case this.stocktwits: case this.rubygems:
            return ['api', version, api+'.json'].join('/');
        // api/v1/endpoint
        case this.openstreetmap:
            return ['api', version, api].join('/');
        // api/endpoint
        case this.slack:
            return ['api', api].join('/');
        
        // endpoint.json
        case this.soundcloud: case this.coderbits:
            return [api+'.json'].join('/');
        // endpoint
        case this.facebook: case this.github: case this.wikimapia:
            return [api].join('/');

        // 
        case this.google:
            var version = options.version||c.providers.google.api[options.api||this.api].version;
            return version
                ? [options.api||this.api, version, api].join('/')
                : [options.api||this.api, api].join('/');
        case this.yahoo:
            var version = options.version||c.providers.yahoo.api[options.api||this.api].version;
            return [version, api].join('/');
    }
}

Provider.prototype.url = function (api, options) {
    var domain = (this.apis && this.apis[options.api||this.api].domain) || this.domain;
    return [domain, this.createPath(api, options)].join('/');
}

Provider.prototype.get = function (uri, options, callback) {
    var params = request.initParams(uri, options, callback);
    var api = params.uri,
        options = params.options,
        callback = params.callback;

    options.method = options.method||'GET';
    options.headers = options.headers||{};
    options.json = (options.json == undefined) ? true : options.json;

    this.options.get.call(this, api, options);

    return request(this.url(api, options), options, utils.response(callback));
}

Provider.prototype.post = function (uri, options, callback) {
    var params = request.initParams(uri, options, callback);
    var api = params.uri,
        options = params.options,
        callback = params.callback;

    options.method = options.method||'POST';
    options.headers = options.headers||{};
    options.json = (options.json == undefined) ? true : options.json;

    this.options.post.call(this, api, options);
    this.options.upload(this, api, options);
    
    return request(this.url(api, options), options, utils.response(callback));
}

Provider.request = request;
exports = module.exports = Provider;
