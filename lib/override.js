
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
        this.before.upload = function (endpoint, options) {
            return /tasks\/.*\/attachments/.test(endpoint);
        }

        this.multipart.create = function (endpoint, options) {
            return this._create('tasks/attachments', options);
        }
    },
    box: function () {
        this.before.get = function (endpoint, options) {
            if (/files\/\d+\/content/.test(endpoint)) {
                options.encoding = null;
            }
        }

        this.before.upload = function (endpoint, options) {
            var api = options.api||this.provider.api;
            if (api == 'upload') {
                return /files\/(?:.*\/)?content/.test(endpoint);
            }
            else if (api == 'view-upload') {
                return endpoint == 'documents';
            }
            else {
                return false;
            }
        }

        this.multipart.create = function (endpoint, options) {
            var api = options.api||this.provider.api;
            if (api == 'upload') {
                return this._create('files/content', options);
            }
            else if (api == 'view-upload') {
                return this._create(endpoint, options);
            }
        }
    },
    dropbox: function () {
        this.before.get = function (endpoint, options) {
            if (options.api == 'files') options.encoding = null;
        }
    },
    flickr: function () {
        // flickr expects the oauth data encoded
        // inside the multipart body
        this.before.multipart = function (endpoint, options) {

            var photo = options.form.photo;
            delete options.form.photo;

            var api = config.flickr.api[options.api];

            var qs = utils.sign({
                signature:'HMAC-SHA1',
                method:'POST',
                url:[api.domain, api.path].join('/'),
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
        this.before.get = function (endpoint, options) {
            var api = options.api||this.provider.api;
            if (api == 'gmaps') {
                if (/^streetview|staticmap$/.test(endpoint)) {
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

        this.before.post = function (endpoint, options) {
            var api = options.api||this.provider.api;
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
        this.before.get = function (endpoint, options) {
            if (!options.headers['x-li-format'])
                options.headers['x-li-format'] = 'json';
        }

        this.before.post = function (endpoint, options) {
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
        this.before.upload = function (endpoint, options) {
            return (
                /.*\/messages/.test(endpoint) &&
                !!options.form.attachment
            );
        }

        this.multipart.create = function (endpoint, options) {
            return this._create('messages', options);
        }
    },
    sendgrid: function () {
        this.before.upload = function (endpoint, options) {
            return (!!options.form.files);
        }

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
    stackexchange: function () {
        this.before.get = function (endpoint, options) {
            options.encoding = null;
        }

        this.before.post = function (endpoint, options) {
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
