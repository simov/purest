
var request = require('request');

var utils = require('./utils'),
    config = require('./config'),
    Query = require('./query'),
    Multipart = require('./multipart'),
    Url = require('./url'),
    refresh = require('./refresh'),
    override = require('./override');
var Options = require('./options').Options,
    Before = require('./options').Before,
    After = require('./options').After;
var providers = require('../config/providers');


function Provider (options) {
    if (!options || !options.provider)
        throw new Error('Purest: provider option is required!');

    config.extend(providers, options.config)
    var provider = providers[options.provider];
    if (!provider) {
        throw new Error('Purest: non existing provider!');
    }

    this.key = options.consumerKey||options.key||null;
    this.secret = options.consumerSecret||options.secret||null;
    this.oauth = provider.__provider.oauth;

    // this.version = options.version||'';
    this.type = options.type||'';

    this.apis = config.aliases(provider)||null;
    if (options.api && (!this.apis || !this.apis[options.api])) {
        throw new Error('Purest: non existing API!');
    }
    this.api = options.api||'__default';

    this.name = options.provider;
    this[options.provider] = true;

    this._config = new Query(this);
    this.options = new Options(this);
    this.before = new Before(this);
    this.after = new After(this);
    this.multipart = new Multipart(this);
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
    options = config.options(endpoint, options, 'get', this.apis[options.api||this.api].endpoints);
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
    options = config.options(endpoint, options, 'post', this.apis[options.api||this.api].endpoints);
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
    options = config.options(endpoint, options, 'put', this.apis[options.api||this.api].endpoints);
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
    options = config.options(endpoint, options, 'del', this.apis[options.api||this.api].endpoints);
    this.before.del(endpoint, options);

    return request(this.url.get(endpoint, options), options, utils.response(callback));
}

Provider.prototype.config = function (name) {
    this._config.config(name);
    return this._config;
}

Provider.prototype.query = function (name) {
    this._config.config(name);
    return this._config;
}

Provider.request = request;
exports = module.exports = Provider;
