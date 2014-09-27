
var zlib = require('zlib'),
    url = require('url');
var moth = require('mashape-oauth');


exports.uri = {
    rfc3986: function (str) {
        return encodeURIComponent(str).replace(/[!*()']/g, function (character) {
            return '%' + character.charCodeAt(0).toString(16);
        });
    },
    qs: function (params) {
        var result = [];
        for (var name in params) {
            result.push(name+'='+this.rfc3986(params[name]));
        }
        return result.join('&');
    }
};

/*args: {
    signature:'plaintext',
    method:'POST',
    url:'https://api.login.yahoo.com/oauth/v2/get_token',
    app:{key:'...', secret:'...'},
    user:{token:'...', secret:'...'},
    params:{some:'params'}
};*/
exports.sign = function (args) {
    var client = new moth.OAuth({
        consumerKey: args.app.key,
        consumerSecret: args.app.secret,
        version: '1.0',
        signatureMethod: args.signature
    });

    var o = url.parse(args.url);
    var requestOptions = {
        method: args.method,
        protocol: o.protocol.replace(':',''),
        hostname: o.hostname,
        pathname: o.pathname,
        query: args.params
    };

    var str = url.format(requestOptions),
        signed = client.signUrl(str, args.user.token, args.user.secret, args.method);

    var opts = url.parse(signed, true);

    return opts.query;
};

exports.agent = function (options) {
    if (options.headers) {
        if (!/.*user-agent.*/i.test(Object.keys(options.headers).join()))
            options.headers['User-Agent'] = 'Purest';
    }
    else {
        options.headers = {'User-Agent': 'Purest'};
    }
};

exports.response = function (cb) {
    return function (err, res, body) {
        if (!cb) return;
        if (err) return cb(err, res, body);

        var encoding = res.headers['content-encoding'],
            type = res.headers['content-type'];
        (function (cb) {
            if (!encoding || !/gzip|deflate/.test(encoding)) return cb(body);
            
            var method = {gzip:'gunzip', deflate:'inflate'};
            zlib[method[encoding]](body, function (err, decoded) {
                if (err) return cb(err, res, body);
                cb(decoded.toString());
            });
        }(function (body) {
            if (typeof body === 'string' && body.indexOf('jsonFlickrApi') == 0) {
                body = body.replace(/jsonFlickrApi\((.*)\)/,'$1');
                try {body = JSON.parse(body)}
                catch (e) {return cb(new Error('Parse error!'), res, body)}
            }
            else if (typeof body === 'string' && body.trim() &&
                (/json|gzip|deflate/.test(encoding) || /json|javascript/.test(type))) {
                try {body = JSON.parse(body)}
                catch (e) {return cb(new Error('Parse error!'), res, body)}
            }
            if(res.statusCode!=200 && res.statusCode!=201 && 
                res.statusCode!=301 && res.statusCode!=302)
                return cb(body, res, body);
            cb(err, res, body);
        }));
    }
}
