
var request = require('request');

var utils = require('./utils'),
    Options = require('./options'),
    Url = require('./url'),
    refresh = require('./refresh');

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

    this.refresh = refresh(this);
}

Provider.prototype.get = function (uri, options, callback) {
    var params = request.initParams(uri, options, callback);
    var endpoint = params.uri,
        options = params.options,
        callback = params.callback;

    options.method = options.method||'GET';
    utils.agent(options);
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
    utils.agent(options);
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
    utils.agent(options);

    this.oauth && options.oauth && this.options.oauth.call(this, options);
    this.options.put.call(this, endpoint, options);

    return request(this.url.get(endpoint, options), options, utils.response(callback));
}

Provider.prototype.del = function (uri, options, callback) {
    var params = request.initParams(uri, options, callback);
    var endpoint = params.uri,
        options = params.options,
        callback = params.callback;

    options.method = options.method||'DELETE';
    utils.agent(options);

    this.oauth && options.oauth && this.options.oauth.call(this, options);
    this.options.del.call(this, endpoint, options);

    return request(this.url.get(endpoint, options), options, utils.response(callback));
}

Provider.request = request;
exports = module.exports = Provider;
