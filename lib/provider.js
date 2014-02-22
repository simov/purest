
var request = require('request');
var config = require('./config');
var utils = require('./utils');
var Options = require('./options');
var providers = require('./provider/index');


function Provider (options) {
    if (!options || !options.provider)
        throw new Error('TinyRest: provider option is required!');

    this.options = new Options();
    
    if (providers.indexOf(options.provider) != -1) {
        var provider = require('./provider/'+options.provider);
        provider.call(this);
    }

    switch (options.provider) {
        case 'linkedin': case 'twitter':
            this.oauth = true;
            this.consumerKey = options.consumerKey;
            this.consumerSecret = options.consumerSecret;
            break;
        case 'bitly': case 'stocktwits': case 'facebook':
        case 'soundcloud': case 'github': case 'stackexchange':
        case 'rubygems': case 'coderbits': case 'google':
            // this.oauth2 = true;
            break;
        default:
            throw new Error('TinyRest: non existing provider!');
            break;
    }
    this.version = options.verison||config[options.provider].version||'';
    this.domain = options.domain||config[options.provider].domain;
    this[options.provider] = true;
}

Provider.prototype.createPath = function (api, args) {
    switch (true) {
        case this.bitly: case this.linkedin: case this.stackexchange:
            return ['', this.version, api].join('/');
        case this.facebook: case this.github:
            return ['', api].join('/');
        case this.stocktwits: case this.rubygems:
            return ['/api', this.version, api+'.json'].join('/');
        case this.twitter:
            return ['', this.version, api+'.json'].join('/');
        case this.soundcloud: case this.coderbits:
            return ['', api+'.json'].join('/');
        case this.google:
            return ['', config.google[args.options.api], api].join('/');
    }
}

Provider.prototype.get = function (api, args, cb) {
    if (typeof args === 'function') {
        cb = args;
        args = {};
    }
    var options = this.options.defaults.call(this, args);

    this.options.get(options, args);

    request.get(this.url(api, args), options, utils.response(cb));
}

Provider.prototype.post = function (api, args, cb) {
    
    var options = this.options.defaults.call(this, args);

    this.options.post(options, args);
    this.options.upload(api, options, args);

    request.post(this.url(api, args), options, utils.response(cb));
}

Provider.prototype.url = function (api, args) {
    return this.domain + this.createPath(api, args);
}

exports = module.exports = Provider;
