
var request = require('request');

var utils = require('./utils'),
    Options = require('./options'),
    Url = require('./url');

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

    this.options = new Options();
    this.url = new Url(this);

    if (c.options.indexOf(options.provider) != -1) {
        var provider = require('./provider/'+options.provider);
        provider.call(this);
    }
}

Provider.prototype.get = function (uri, options, callback) {
    var params = request.initParams(uri, options, callback);
    var endpoint = params.uri,
        options = params.options,
        callback = params.callback;

    options.method = options.method||'GET';

    if (options.headers) {
        if (!/.*user-agent.*/i.test(Object.keys(options.headers).join()))
            options.headers['User-Agent'] = 'Purest';
    }
    else {
        options.headers = {'User-Agent': 'Purest'};
    }
    
    options.json = (options.json == undefined) ? true : options.json;

    this.oauth && options.oauth && this.options.oauth.call(this, options);
    this.options.get.call(this, endpoint, options);

    return request(this.url.get(endpoint, options), options, utils.response(callback));
}

Provider.prototype.post = function (uri, options, callback) {
    var params = request.initParams(uri, options, callback);
    var endpoint = params.uri,
        options = params.options,
        callback = params.callback;

    options.method = options.method||'POST';

    if (options.headers) {
        if (!/.*user-agent.*/i.test(Object.keys(options.headers).join()))
            options.headers['User-Agent'] = 'Purest';
    }
    else {
        options.headers = {'User-Agent': 'Purest'};
    }

    options.json = (options.json == undefined) ? true : options.json;

    this.oauth && options.oauth && this.options.oauth.call(this, options);
    this.options.post.call(this, endpoint, options);
    this.options.upload(this, endpoint, options);

    return request(this.url.get(endpoint, options), options, utils.response(callback));
}

Provider.prototype.put = function (uri, options, callback) {
    var params = request.initParams(uri, options, callback);
    var endpoint = params.uri,
        options = params.options,
        callback = params.callback;

    options.method = options.method||'PUT';

    if (options.headers) {
        if (!/.*user-agent.*/i.test(Object.keys(options.headers).join()))
            options.headers['User-Agent'] = 'Purest';
    }
    else {
        options.headers = {'User-Agent': 'Purest'};
    }

    this.oauth && options.oauth && this.options.oauth.call(this, options);
    this.options.put.call(this, endpoint, options);

    return request(this.url.get(endpoint, options), options, utils.response(callback));
}

Provider.request = request;
exports = module.exports = Provider;
