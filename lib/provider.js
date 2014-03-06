
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
        case this.gmaps: case this.yahoo:
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
    }
}

Provider.prototype.url = function (api, options) {
    var domain = this.yahoo ? c.providers.yahoo[options.api].domain : this.domain;
    return domain + this.createPath(api, options);
}


Provider.prototype.get = function (uri, options, callback) {
    var params = request.initParams(uri, options, callback);
    var api = params.uri,
        options = params.options;

    options.method = 'GET';
    options.headers = options.headers||{};
    options.json = true;

    this.options.get.call(this, api, options);
    
    return request(this.url(api, options), options, utils.response(params.callback));
    // return request(params.uri || null, params.options, params.callback);
}
Provider.prototype.post = function (uri, options, callback) {
    var params = request.initParams(uri, options, callback);
    var api = params.uri,
        options = params.options;

    options.method = 'POST';
    options.headers = options.headers||{};
    options.json = true;

    this.options.post.call(this, api, options);
    this.options.upload(this, api, options);
    
    return request(this.url(api, options), options, utils.response(params.callback));
    // return request(params.uri || null, params.options, params.callback);
}


// Provider.prototype.put = function (uri, options, callback) {
//   var params = request.initParams(uri, options, callback)
//   params.options.method = 'PUT'
//   // code
//   return request(params.uri || null, params.options, params.callback)
// }
// Provider.prototype.patch = function (uri, options, callback) {
//   var params = request.initParams(uri, options, callback)
//   params.options.method = 'PATCH'
//   // code
//   return request(params.uri || null, params.options, params.callback)
// }
// Provider.prototype.head = function (uri, options, callback) {
//   var params = request.initParams(uri, options, callback)
//   params.options.method = 'HEAD'
//   if (params.options.body ||
//       params.options.requestBodyStream ||
//       (params.options.json && typeof params.options.json !== 'boolean') ||
//       params.options.multipart) {
//     throw new Error("HTTP HEAD requests MUST NOT include a request body.")
//   }
//   // code
//   return request(params.uri || null, params.options, params.callback)
// }
// Provider.prototype.del = function (uri, options, callback) {
//   var params = request.initParams(uri, options, callback)
//   params.options.method = 'DELETE'
//   if(typeof params.options._requester === 'function') {
//     request = params.options._requester
//   }
//   // code
//   return request(params.uri || null, params.options, params.callback)
// }

Provider.request = request;
exports = module.exports = Provider;
