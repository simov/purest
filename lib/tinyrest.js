
var querystring = require('querystring');
var oauth = require('oauth');


function ctor (fctor, aArgs) {
    var obj = Object.create(fctor.prototype);
    fctor.apply(obj, aArgs);
    return obj;
}

function BitLy (options) {
    this.bitly = true;
    this.oauth2 = true;
    this.version = options.verison||'v3';
    this.endpoint = options.endpoint||'https://api-ssl.bitly.com';
    // clientId, clientSecret, baseSite, authorizePath, accessTokenPath, customHeaders
    this.oauth = new ctor(oauth.OAuth2, options.oauth);
}
BitLy.prototype.createPath = function (api) {
    return ['', this.version, api].join('/');
}
function StockTwits (options) {
    this.stocktwits = true;
    this.oauth2 = true;
    this.version = options.verison||'2';
    this.endpoint = options.endpoint||'https://api.stocktwits.com';
    // clientId, clientSecret, baseSite, authorizePath, accessTokenPath, customHeaders
    this.oauth = new ctor(oauth.OAuth2, options.oauth);
}
StockTwits.prototype.createPath = function (api) {
    return ['/api', this.version, api+'.json'].join('/');
}
function LinkedIn (options) {
    this.linkedin = true;
    this.oauth1 = true;
    this.version = options.verison||'v1';
    this.endpoint = options.endpoint||'http://api.linkedin.com';
    var params = [
        // requestUrl, accessUrl, consumerKey, consumerSecret, version,
        '','',options.consumerKey,options.consumerSecret,'1.0',
        // authorize_callback, signatureMethod, nonceSize, customHeaders
        '','HMAC-SHA1',null,{
            'Accept':'*/*','Connection':'close','x-li-format':'json'
        }];
    this.oauth = new ctor(oauth.OAuth, params);
}
LinkedIn.prototype.createPath = function (api) {
    return ['', this.version, api].join('/');
}
function Twitter (options) {
    this.twitter = true;
    this.oauth1 = true;
    this.version = options.verison||'1.1';
    this.endpoint = options.endpoint||'https://api.twitter.com';
    var params = [
        // requestUrl, accessUrl, consumerKey, consumerSecret, version,
        '','',options.consumerKey,options.consumerSecret,'1.0',
        // authorize_callback, signatureMethod, nonceSize, customHeaders
        '','HMAC-SHA1',null,null];
    this.oauth = new ctor(oauth.OAuth, params);
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
    var result = [];
    for (var name in params) {
        result.push(name+'='+params[name]);
    }
    return encodeURI(result.join('&'));
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
// parse response data
function parse (data) {
    var result = null;
    try {
        result = JSON.parse(data);
    }
    catch (e) {
        result = querystring.parse(data);
    }
    return result;
}

// query params can be omitted
TinyRest.prototype.get = function (api, params, cb) {
    if (typeof params === 'function') {
        cb = params;
        params = {};
    }
    switch (true) {
        case this.provider.oauth2:
            var url = this.provider.endpoint + this.getPath(api, params);
            this.provider.oauth._request(
                // method, url, headers, post_body, access_token, callback
                'GET', url, null, null, null,
            function (err, data, res) {
                cb(err, parse(data), res);
            });
            break;
        case this.provider.oauth1:
            var custom = this.getCustom(params),
                url = this.provider.endpoint + this.getPath(api, params);
            this.provider.oauth._performSecureRequest(
                // oauth_token, oauth_token_secret, method, url, extra_params,
                custom.token, custom.secret, 'GET', url, null,
                // post_body, post_content_type, callback
                '', null,
            function (err, data, res) {
                cb(err, parse(data), res);
            });
            break;
    }
}

// params - query params, data - post params
TinyRest.prototype.post = function (api, params, data, cb) {
    // probably check for optional parameters

    switch (true) {
        case this.provider.oauth2:
            var content = this.toQueryString(data);
            var url = this.provider.endpoint + this.getPath(api, params);
            this.provider.oauth._request(
                // method, url, headers, post_body, access_token, callback
                'POST', url, null, content, null,
            function (err, data, res) {
                cb(err, parse(data), res);
            });
            break;
        case this.provider.oauth1:
            var custom = this.getCustom(params),
                url = this.provider.endpoint + this.getPath(api, params);
            
            if (this.provider.linkedin) data = JSON.stringify(data);

            this.provider.oauth.post(
                // url, oauth_token, oauth_token_secret, post_body, post_content_type, callback
                url, custom.token, custom.secret, data, custom.binary,
            function (err, data, res) {
                cb(err, parse(data), res);
            });
            break;
    }
}

module.exports = TinyRest;
