
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

    var config = c.providers[options.provider];
    if (!config) {
        throw new Error('purest: non existing provider!');
    }

    this.options = new Options();
    
    if (c.options.indexOf(options.provider) != -1) {
        var provider = require('./provider/'+options.provider);
        provider.call(this);
    }

    this.key = options.consumerKey||options.key||null;
    this.secret = options.consumerSecret||options.secret||null;
    this.oauth = config.oauth;

    this.version = options.version||config.version||'';
    this.domain = options.domain||config.domain||'';
    this.path = options.path||config.path||'';

    this.api = options.api||'';
    this.apis = config.api||null;

    this.name = options.provider;
    this[options.provider] = true;
}

Provider.prototype.createPath = function (endpoint, options) {
    options = options||{};
    var version = options.version||this.version;
    switch (true) {
        // v1/endpoint.json
        case this.twitter: case this.mailchimp:
            return [version, endpoint+'.json'].join('/');
        // v1/endpoint
        case this.bitly: case this.linkedin: case this.stackexchange:
        case this.foursquare: case this.instagram: case this.trello:
        case this.dropbox:
            return [version, endpoint].join('/');
        
        // api/v1/endpoint.json
        case this.stocktwits: case this.rubygems:
            return ['api', version, endpoint+'.json'].join('/');
        // api/v1/endpoint
        case this.asana: case this.openstreetmap:
            return ['api', version, endpoint].join('/');
        // api/endpoint
        case this.slack:
            return ['api', endpoint].join('/');
        
        // endpoint.json
        case this.soundcloud: case this.coderbits:
            return [endpoint+'.json'].join('/');
        // endpoint
        case this.facebook: case this.github: case this.wikimapia:
        case this.heroku:
            return [endpoint].join('/');

        // path/endpoint
        case this.gmaps:
            return [this.path, endpoint].join('/');

        // sub api
        case this.google: case this.yahoo: case this.flickr:
            var name = options.api||this.api,
                api = this.apis[name];

            // apipath
            if (this.flickr) {
                return api ? (api.path||name) : this.path;
            }
                
            var version = options.version||api.version,
                path = api.path||name;

            // apiname|apipath/apiver/endpoint
            // apiname|apipath/endpoint
            if (this.google) {
                return version
                    ? [path, version, endpoint].join('/')
                    : [path, endpoint].join('/');
            }

            // apiversion/endpoint
            if (this.yahoo) {
                return [version, endpoint].join('/');
            }
    }
}

Provider.prototype.url = function (api, options) {
    options = options||{};
    var name = options.api||this.api,
        domain = (this.apis && this.apis[name] && this.apis[name].domain) || this.domain;
    return [domain, this.createPath(api, options)].join('/');
}

Provider.prototype.get = function (uri, options, callback) {
    var params = request.initParams(uri, options, callback);
    var api = params.uri,
        options = params.options,
        callback = params.callback;

    options.method = options.method||'GET';
    options.headers = options.headers||{};
    options.qs = options.qs||{};
    options.json = (options.json == undefined) ? true : options.json;

    this.oauth && options.oauth && this.options.oauth.call(this, options);
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
    options.qs = options.qs||{};
    options.json = (options.json == undefined) ? true : options.json;

    this.oauth && options.oauth && this.options.oauth.call(this, options);
    this.options.post.call(this, api, options);
    this.options.upload(this, api, options);

    return request(this.url(api, options), options, utils.response(callback));
}

Provider.request = request;
exports = module.exports = Provider;
