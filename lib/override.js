
var mime = require('mime-types');
var utils = require('./utils');
var config = require('../config/providers')


exports = module.exports = function (provider) {
    if (map[provider.name]) {
        map[provider.name].call(provider);
    }
}


var map = {
    flickr: function () {
        // flickr expects the oauth data encoded
        // inside the multipart body
        this.before.multipart = function (endpoint, options) {

            var photo = options.form.photo;
            delete options.form.photo;

            var api = this.provider.apis[options.api||this.provider.api];

            var qs = utils.sign({
                signature:'HMAC-SHA1',
                method:'POST',
                url:[api.domain, api.path.replace('{endpoint}',endpoint)].join('/'),
                app:{key:this.provider.key, secret:this.provider.secret},
                user:{token:options.oauth.token, secret:options.oauth.token_secret},
                params:options.form
            });

            qs.photo = photo;
            options.form = qs;
        }

        this.after.multipart = function (endpoint, options) {
            delete options.oauth;
        }
    },
    google: function () {
        this.url.endpoint = function (endpoint, options) {
            var api = options.api||this.provider.api;
            if (api == 'gmaps') {
                var match = endpoint.match(
                    /(?:geocode|directions|timezone|elevation|distancematrix)(?:\/(json|xml))?/);
                return (match && !match[1])
                    ? endpoint + '/json'
                    : endpoint;
            }
            else {
                return endpoint;
            }
        }
    },
    linkedin: function () {
        this.before.post = function (endpoint, options) {
            options.body = JSON.stringify(options.form||{});
            delete options.form;
        }
    },
    mailchimp: function () {
        this.url.domain = function (domain, options) {
            // options or apikey
            if (options.dc || /.*-\w{2}\d+/.test(options.qs.apikey)) {
                var dc = options.dc
                    ? options.dc
                    : options.qs.apikey.replace(/.*-(\w{2}\d+)/,'$1');
                return domain.replace('[dc]', dc);
            }
            // token
            else throw new Error('Purest: specify data center to use through the dc option!');
        }
    },
    sendgrid: function () {
        this.multipart.file = function (key, file, content) {
            return {
                'content-disposition': 'form-data; name="'+key+'['+file+']"; filename="'+file+'"',
                'content-type': mime.lookup(file),
                'content-transfer-encoding': 'binary',
                body: content
            };
        }
    },
    soundcloud: function () {
        // soundcloud doensn't like content-type
        this.after.multipart = function (endpoint, options) {
            for (var i=0; i < options.multipart.length; i++) {
                delete options.multipart[i]['content-type'];
            }
        }
    },
    twitter: function () {
        this.url.qs = function (endpoint, options) {
            // posting but not uploading
            if (options.form && !this.provider.multipart[endpoint]) {

                var qs = utils.uri.qs(options.form);
                delete options.form;

                return (qs && ('?'+qs));
            }
            // get
            else {
                return '';
            }
        }
    }
};
