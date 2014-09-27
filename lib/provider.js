
var request = require('request');

var utils = require('./utils'),
    Options = require('./options').Options,
    Before = require('./options').Before,
    After = require('./options').After,
    Multipart = require('./multipart'),
    Url = require('./url'),
    refresh = require('./refresh'),
    override = require('./override');
var providers = require('../config/providers');


function Provider (options) {
    if (!options || !options.provider)
        throw new Error('Purest: provider option is required!');

    var config = providers[options.provider];
    if (!config) {
        throw new Error('Purest: non existing provider!');
    }

    this.key = options.consumerKey||options.key||null;
    this.secret = options.consumerSecret||options.secret||null;
    this.oauth = config.oauth;

    this.version = options.version||config.version||'';
    this.domain = options.domain||config.domain||'';
    this.path = options.path||config.path||'';
    this.type = options.type||'';
    this.format = config.format;

    this.apis = config.api||null;
    if (options.api && (!this.apis || !this.apis[options.api])) {
        throw new Error('Purest: non existing API!');
    }
    this.api = options.api||'';

    this.name = options.provider;
    this[options.provider] = true;

    this.options = new Options(this);
    this.before = new Before(this);
    this.after = new After(this);
    this.multipart = new Multipart(this, config.multipart);
    this.url = new Url(this);
    this.refresh = refresh(this);
    override(this);
}

Provider.prototype.get = function (uri, options, callback) {
    var params = request.initParams(uri, options, callback);
    var endpoint = params.uri,
        options = params.options,
        callback = params.callback;

    options.method = options.method||'GET';
    utils.agent(options);
    options.json = (options.json == undefined) ? true : options.json;

    this.oauth && options.oauth && this.options.oauth(options);
    this.before.get(endpoint, options);

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

    this.oauth && options.oauth && this.options.oauth(options);
    this.before.post(endpoint, options);
    this.options.upload(endpoint, options);

    return request(this.url.get(endpoint, options), options, utils.response(callback));
}

Provider.prototype.put = function (uri, options, callback) {
    var params = request.initParams(uri, options, callback);
    var endpoint = params.uri,
        options = params.options,
        callback = params.callback;

    options.method = options.method||'PUT';
    utils.agent(options);

    this.oauth && options.oauth && this.options.oauth(options);
    this.before.put(endpoint, options);

    return request(this.url.get(endpoint, options), options, utils.response(callback));
}

Provider.prototype.del = function (uri, options, callback) {
    var params = request.initParams(uri, options, callback);
    var endpoint = params.uri,
        options = params.options,
        callback = params.callback;

    options.method = options.method||'DELETE';
    utils.agent(options);

    this.oauth && options.oauth && this.options.oauth(options);
    this.before.del(endpoint, options);

    return request(this.url.get(endpoint, options), options, utils.response(callback));
}

Provider.request = request;
exports = module.exports = Provider;
