
var request = require('request');
var config = require('./config');


function Provider (options) {
    switch (options.provider) {
        case 'linkedin': case 'twitter':
            this.oauth1 = true;
            this.consumerKey = options.consumerKey;
            this.consumerSecret = options.consumerSecret;
            break;
        case 'bitly': case 'stocktwits':
            this.oauth2 = true;
            break;
        default:
            throw new Error('TinyRest: non existing provider!');
            break;
    }
    this.version = options.verison||config[options.provider].version;
    this.endpoint = options.endpoint||config[options.provider].endpoint;
    this[options.provider] = true;
}

Provider.prototype.createPath = function (api) {
    switch (true) {
        case this.bitly: case this.linkedin:
            return ['', this.version, api].join('/');
        case this.stocktwits:
            return ['/api', this.version, api+'.json'].join('/');
        case this.twitter:
            return ['', this.version, api+'.json'].join('/');
    }
}

function TinyRest (options) {
    if (!options || !options.provider)
        throw new Error('TinyRest: provider option is required!');
    this.provider = new Provider(options);
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
            token: params.t_token,
            secret: params.t_secret,
            mime: params.t_mime
        };
        delete params.t_token;
        delete params.t_secret;
        delete params.t_mime;
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
        if (data.hasOwnProperty('media[]')) {
            // prepare multipart body
            options.multipart = this.getMultipartItems(data, custom);
            options.headers = {'content-type': 'multipart/form-data'};
            delete options.json;
            var url = this.provider.endpoint + this.provider.createPath(api);
        } else {
            // encode the params into the url
            var url = this.provider.endpoint + this.getPath(api, data);
        }
    }
    // just the uri without encoded params into it
    if (this.provider.linkedin) {
        var url = this.provider.endpoint + this.provider.createPath(api);
    }
    request.post(url, options, function (err, res, body) {
        if (err) return cb(err, res, body);
        if (typeof body === 'string') {
            try {body = JSON.parse(body)}
            catch (e) {return cb(new Error('Parse error!'), res, body)}
        }
        if(res.statusCode!=200 && res.statusCode!=201 && 
            res.statusCode!=301 && res.statusCode!=302)
            return cb(body, res, body);
        cb(err, res, body);
    });
}

TinyRest.prototype.getMultipartItems = function (params, custom) {
    var multipartItems = [];
    for (key in params) {
        var multipartItem = {};

        var contentDisposition = 'form-data; name="' + key + '"',
            contentType = 'text/plain',
            body = params[key];

        if (key == 'media[]') {
            var supported = ['image/gif', 'image/jpeg', 'image/png'];
            if (supported.indexOf(custom.mime) == -1) {
                throw new Error('Unsupported media type.');
            }
            contentType = custom.mime;
            multipartItem['content-transfer-encoding'] = 'utf8';
        }

        multipartItem['content-disposition'] = contentDisposition;
        multipartItem['content-type'] = contentType;
        multipartItem.body = body;

        multipartItems.push(multipartItem);
    }

    return multipartItems;
}

module.exports = TinyRest;
