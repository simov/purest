
var request = require('request');


function BitLy (options) {
    this.bitly = true;
    this.oauth2 = true;
    this.version = options.verison||'v3';
    this.endpoint = options.endpoint||'https://api-ssl.bitly.com';
}
BitLy.prototype.createPath = function (api) {
    return ['', this.version, api].join('/');
}
function StockTwits (options) {
    this.stocktwits = true;
    this.oauth2 = true;
    this.version = options.verison||'2';
    this.endpoint = options.endpoint||'https://api.stocktwits.com';
}
StockTwits.prototype.createPath = function (api) {
    return ['/api', this.version, api+'.json'].join('/');
}
function LinkedIn (options) {
    this.linkedin = true;
    this.oauth1 = true;
    this.version = options.verison||'v1';
    this.endpoint = options.endpoint||'http://api.linkedin.com';
    this.consumerKey = options.consumerKey;
    this.consumerSecret = options.consumerSecret;
}
LinkedIn.prototype.createPath = function (api) {
    return ['', this.version, api].join('/');
}
function Twitter (options) {
    this.twitter = true;
    this.oauth1 = true;
    this.version = options.verison||'1.1';
    this.endpoint = options.endpoint||'https://api.twitter.com';
    this.consumerKey = options.consumerKey;
    this.consumerSecret = options.consumerSecret;
}
Twitter.prototype.createPath = function (api) {
    return ['', this.version, api+'.json'].join('/');
}

function TinyRest (options) {
    if (!options || !options.provider)
        throw new Error('TinyRest: provider option is required!');
    switch (options.provider) {
        case 'bitly':
            this.provider = new BitLy(options);
            break;
        case 'stocktwits':
            this.provider = new StockTwits(options);
            break;
        case 'linkedin':
            this.provider = new LinkedIn(options);
            break;
        case 'twitter':
            this.provider = new Twitter(options);
            break;
        default:
            throw new Error('TinyRest: non existing provider!');
            break;
    }
}

// converts params into a query string
TinyRest.prototype.toQueryString = function (params) {
    var escape = function(str) {
        return encodeURIComponent(str).replace(/[!*()']/g, function(character) {
            return '%' + character.charCodeAt(0).toString(16);
        });
    };
    var result = [];
    for (var name in params) {
        result.push(name+'='+escape(params[name]));
    }
    // return encodeURI(result.join('&'));
    return result.join('&');
}

// create an url path for the given api and params
TinyRest.prototype.getPath = function (api, params) {
    var params = params || {},
        path = this.provider.createPath(api);
    if (Object.keys(params).length) {
        path += '?'+this.toQueryString(params);
    }
    return path;
}

// get custom parameters specific to tinyrest
TinyRest.prototype.getCustom = function (params) {
    if (this.provider.oauth1) {
        var custom = {
            token: params.oauth_token,
            secret: params.oauth_token_secret,
            binary: params.binary ? 'multipart/form-data' : 'application/json;charset=UTF-8'
            // binary: params.binary ? 'application/octet-stream' : 'application/json;charset=UTF-8'
        };
        delete params.oauth_token;
        delete params.oauth_token_secret;
        delete params.binary;
    }
    return custom;
}

// query params can be omitted
TinyRest.prototype.get = function (api, params, cb) {
    if (typeof params === 'function') {
        cb = params;
        params = {};
    }
    switch (true) {
        case this.provider.oauth2:
            var options = {
                qs: params,
                json: true
            };
            break;
        case this.provider.oauth1:
            var custom = this.getCustom(params);
            var options = {
                qs: params,
                oauth: {
                    consumer_key: this.provider.consumerKey,
                    consumer_secret: this.provider.consumerSecret,
                    token: custom.token,
                    token_secret: custom.secret
                },
                json: true
            };
            if (this.provider.linkedin) {
                options.headers = {'x-li-format': 'json'};
            }
            break;
    }
    var url = this.provider.endpoint + this.provider.createPath(api);
    request.get(url, options, function (err, res, body) {
        if (err) return cb(err, res, body);
        if(res.statusCode!=200 && res.statusCode!=301 && res.statusCode!=302)
            return cb(body, res, body);
        cb(err, res, body);
    });
}

// params - query params, data - post params
TinyRest.prototype.post = function (api, params, data, cb) {
    switch (true) {
        case this.provider.oauth2:
            var options = {
                qs: params,
                form: data,//
                json: true
            };
            break;
        case this.provider.oauth1:
            var custom = this.getCustom(params);
            var options = {
                // qs: params,
                // form: data,//
                oauth: {
                    consumer_key: this.provider.consumerKey,
                    consumer_secret: this.provider.consumerSecret,
                    token: custom.token,
                    token_secret: custom.secret
                },
                json: true
            };
            if (this.provider.linkedin) {
                options.headers = {'x-li-format': 'json'};
                options.body = JSON.stringify(data);
            }
            break;
    }
    if (this.provider.twitter) {
        var url = this.provider.endpoint + this.getPath(api, data);
    } else {
        var url = this.provider.endpoint + this.provider.createPath(api);
    }
    request.post(url, options, function (err, res, body) {
        if (err) return cb(err, res, body);
        if(res.statusCode!=200 && res.statusCode!=201 && 
            res.statusCode!=301 && res.statusCode!=302)
            return cb(body, res, body);
        cb(err, res, body);
    });
}

module.exports = TinyRest;
