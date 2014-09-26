
var mime = require('mime-types');
var utils = require('./utils');
var config = require('../config/providers')


exports = module.exports = function (provider) {
    if (map[provider.name]) {
        map[provider.name].call(provider);
    }
}


var map = {
    asana: function () {
        this.options._upload.before = function (provider, endpoint, options) {
            if (!options.upload || !provider.multipart) return;
            if (!/tasks\/.*\/attachments/.test(endpoint)) return;
            return true;
        }

        this.options._upload.create = function (multipart, provider, endpoint, options) {
            return multipart.create(provider, 'tasks/attachments', options);
        }
    },
    box: function () {
        this.options._upload.before = function (provider, endpoint, options) {
            if (!options.upload || !provider.multipart) return;
            if (!/files\/(?:.*\/)?content/.test(endpoint)) return;
            if (options.api != 'upload') return;
            return true;
        }

        this.options._upload.create = function (multipart, provider, endpoint, options) {
            return multipart.create(provider, 'files/content', options);
        }
    },
    dropbox: function () {
        this.options.get = function (endpoint, options) {
            if (options.api == 'files')
                options.encoding = null;
        }
    },
    flickr: function () {
        // flickr expects the oauth data encoded
        // inside the multipart body
        this.options.multipart.before = function (provider, endpoint, options) {

            var photo = options.form.photo;
            delete options.form.photo;

            var api = config.flickr.api[options.api];

            var qs = utils.sign({
                signature:'HMAC-SHA1',
                method:'POST',
                url:[api.domain, api.path].join('/'),
                app:{key:provider.key, secret:provider.secret},
                user:{token:options.oauth.token, secret:options.oauth.token_secret},
                params:options.form
            });

            qs.photo = photo;
            options.form = qs;
        }

        this.options.multipart.after = function (provider, endpoint, options) {
            delete options.oauth;
        }
    },
    google: function () {
        this.options.get = function (endpoint, options) {
            var api = options.api||this.api;
            if (api == 'gmaps') {
                if (endpoint == 'streetview' || endpoint == 'staticmap') {
                    options.encoding = null;
                }
            }
            else if (api == 'contacts') {
                if (!options.headers['GData-Version'])
                    options.headers['GData-Version'] = '3.0';

                if (options.qs && !options.qs.alt)
                    options.qs.alt = 'json';
            }
        }

        this.options.post = function (endpoint, options) {
            var api = options.api||this.api;
            if (api == 'contacts') {
                if (!options.headers['GData-Version'])
                    options.headers['GData-Version'] = '3.0';

                if (options.qs && !options.qs.alt)
                    options.qs.alt = 'json';
            }
        }

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
        this.options.get = function (endpoint, options) {
            if (!options.headers['x-li-format'])
                options.headers['x-li-format'] = 'json';
        }

        this.options.post = function (endpoint, options) {
            if (!options.headers['x-li-format'])
                options.headers['x-li-format'] = 'json';
            
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
                return domain.replace('dc', dc);
            }
            // token
            else throw new Error('Purest: specify data center to use through the dc option!');
        }
    },
    mailgun: function () {
        this.options._upload.before = function (provider, endpoint, options) {
            if (!options.upload || !provider.multipart) return;
            if (!/.*\/messages/.test(endpoint)) return;
            if (!options.form.attachment) return;
            return true;
        }

        this.options._upload.create = function (multipart, provider, endpoint, options) {
            return multipart.create(provider, 'messages', options);
        }
    },
    sendgrid: function () {
        this.options._upload.before = function (provider, endpoint, options) {
            if (!options.upload || !provider.multipart) return;
            if (!provider.multipart[endpoint]) return;
            if (!options.form.files) return;
            return true;
        }

        this.options.multipart.file = function (key, file, content) {
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
        this.options.multipart.after = function (provider, endpoint, options) {
            for (var i=0; i < options.multipart.length; i++) {
                delete options.multipart[i]['content-type'];
            }
        }
    },
    stackexchange: function () {
        this.options.get = function (endpoint, options) {
            options.encoding = null;
        }

        this.options.post = function (endpoint, options) {
            options.encoding = null;
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
