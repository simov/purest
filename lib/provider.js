
var request = require('request');

var utils = require('./utils'),
    Options = require('./options');

var c = {
    providers: require('../config/providers'),
    options: require('./provider/index')
};


function Provider (options) {
    if (!options || !options.provider)
        throw new Error('TinyRest: provider option is required!');
    if (!c.providers[options.provider]) {
        throw new Error('TinyRest: non existing provider!');
    }

    this.options = new Options();
    
    if (c.options.indexOf(options.provider) != -1) {
        var provider = require('./provider/'+options.provider);
        provider.call(this);
    }

    this.consumerKey = options.consumerKey||null;
    this.consumerSecret = options.consumerSecret||null;

    this.api = options.api||'';
    this.version = options.version||c.providers[options.provider].version||'';
    this.domain = options.domain||c.providers[options.provider].domain||'';

    this.name = options.provider;
    this[options.provider] = true;
}

Provider.prototype.createPath = function (api, options) {
    switch (true) {
        case this.bitly: case this.linkedin: case this.stackexchange:
        case this.gmaps: case this.foursquare:
            return ['', this.version, api].join('/');
        case this.facebook: case this.github: case this.wikimapia:
            return ['', api].join('/');
        case this.stocktwits: case this.rubygems:
            return ['/api', this.version, api+'.json'].join('/');
        case this.twitter:
            return ['', this.version, api+'.json'].join('/');
        case this.soundcloud: case this.coderbits:
            return ['', api+'.json'].join('/');
        case this.google:
            var version = options.version||c.providers.google.api[options.api||this.api];
            return ['', options.api||this.api, version, api].join('/');
        case this.yahoo:
            var version = options.version||c.providers.yahoo.api[options.api||this.api].version;
            return ['', version, api].join('/');
    }
}

Provider.prototype.url = function (api, options) {
    return this.domain + this.createPath(api, options);
}

Provider.prototype.get = function (uri, options, callback) {
    var params = request.initParams(uri, options, callback);
    var api = params.uri,
        options = params.options;

    options.method = options.method||'GET';
    options.headers = options.headers||{};
    options.json = true;

    this.options.get.call(this, api, options);

    return request(this.url(api, options), options, utils.response(params.callback));
}

Provider.prototype.post = function (uri, options, callback) {
    var params = request.initParams(uri, options, callback);
    var api = params.uri,
        options = params.options;

    options.method = options.method||'POST';
    options.headers = options.headers||{};
    options.json = true;

    this.options.post.call(this, api, options);
    this.options.upload(this, api, options);
    
    return request(this.url(api, options), options, utils.response(params.callback));
}

Provider.request = request;
exports = module.exports = Provider;
