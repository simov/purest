
var querystring = require('querystring');
var oauth = require('oauth');


// var cApply = function (c) {
// 	var ctor = function (args) {
// 		c.apply(this, args);
// 	};
// 	ctor.prototype = c.prototype;
// 	return ctor;
// };
function ctor (fctor, aArgs) {
    var obj = Object.create(fctor.prototype);
    fctor.apply(obj, aArgs);
    return obj;
}

function BitLy (options) {
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
    this.oauth1 = true;
    this.version = options.verison||'v1';
    this.endpoint = options.endpoint||'http://api.linkedin.com';
    // requestUrl, accessUrl, consumerKey, consumerSecret, version,
    // authorize_callback, signatureMethod, nonceSize, customHeaders
    var params = [
        '','',options.consumerKey,options.consumerSecret,'1.0',
        '','HMAC-SHA1',null,{
            'Accept':'*/*','Connection':'close','x-li-format':'json'
        }];
    this.oauth = new ctor(oauth.OAuth, params);
}
LinkedIn.prototype.createPath = function (api) {
    return ['', this.version, api].join('/');
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

// query params can be omitted
TinyRest.prototype.get = function (api, params, cb) {
    if (typeof params === 'function') {
        cb = params;
        params = {};
    }
    switch (true) {
        case this.provider.oauth2:
            var url = this.provider.endpoint + this.getPath(api, params);
            // method, url, headers, post_body, access_token, callback
            this.provider.oauth._request('GET', url, null, null, null, function (err, data, res) {
                var results;
                try {
                    results = JSON.parse(data);
                }
                catch (e) {
                    results = querystring.parse(data);
                }
                cb(err, results, res);
            });
            break;
        case this.provider.oauth1:
            var token = params.oauth_token,
                secret = params.oauth_token_secret;
            delete params.oauth_token;
            delete params.oauth_token_secret;
            var url = this.provider.endpoint + this.getPath(api, params);
            // oauth_token, oauth_token_secret, method, url, extra_params,
            // post_body, post_content_type, callback
            this.provider.oauth._performSecureRequest(
                token,secret,'GET',url,null,'',null, function (err, data, res) {
                var results;
                try {
                    results = JSON.parse(data);
                }
                catch (e) {
                    results = querystring.parse(data);
                }
                cb(err, results, res);
            });
            break;	
    }
    
}

// params - query params, data - post params
TinyRest.prototype.post = function (api, params, data, cb) {
    var content = this.toQueryString(data),
        url = this.endpoint + this.getPath(api, params);	
    // method, url, headers, post_body, access_token, callback
    this.provider.oauth._request('POST', url, null, content, null, cb);
}

module.exports = TinyRest;
