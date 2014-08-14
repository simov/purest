
var zlib = require('zlib');


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
            if (typeof body === 'string' &&
                (/json|gzip|deflate/.test(encoding) || /json|javascript/.test(type))) {
                try {body = JSON.parse(body)}
                catch (e) {return cb(new Error('Parse error!'), res, body)}
            }
            else if (typeof body === 'string' && body.indexOf('jsonFlickrApi') == 0) {
                body = body.replace(/jsonFlickrApi\((.*)\)/,'$1');
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
