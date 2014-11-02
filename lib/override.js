
var mime = require('mime-types'),
    extend = require('extend');
var utils = require('./utils');
var config = require('../config/providers');


exports = module.exports = function (provider) {
    if (map[provider.name]) {
        map[provider.name].call(provider);
    }
}


var map = {
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
    imgur: function () {
        function auth (endpoint, options) {
            if (options.auth && options.auth.bearer.length < 20) {
                extend(true, options.headers, {
                    Authorization: 'Client-ID '+options.auth.bearer
                });
                delete options.auth;
            }
        }
        this.before.get = function (endpoint, options) {
            auth(endpoint, options);
        }
        this.before.post = function (endpoint, options) {
            auth(endpoint, options);
        }
        this.before.put = function (endpoint, options) {
            auth(endpoint, options);
        }
        this.before.del = function (endpoint, options) {
            auth(endpoint, options);
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
            else throw new Error(
                'Purest: specify data center to use through the dc option!');
        }
    },
    openstreetmap: function () {
        function auth (endpoint, options) {
            if (options.oauth.token.length < 30) {
                options.auth = {
                    user: options.oauth.token,
                    pass: options.oauth.token_secret
                }
                delete options.oauth;
            }
        }
        this.before.get = function (endpoint, options) {
            auth(endpoint, options);
        }
        this.before.post = function (endpoint, options) {
            auth(endpoint, options);
        }
        this.before.put = function (endpoint, options) {
            auth(endpoint, options);
        }
        this.before.del = function (endpoint, options) {
            auth(endpoint, options);
        }
    },
    paypal: function () {
        this.url.domain = function (domain, options) {
            if (!options.sandbox) return domain;
            delete options.sandbox;
            return domain.replace('api','api.sandbox');
        }
    },
    salesforce: function () {
        this.url.domain = function (domain, options) {
            if (options.domain) {
                var _domain = options.domain;
                delete options.domain;
                return domain.replace('[domain]', _domain);
            }
            else throw new Error(
                'Purest: specify domain name to use through the domain option!');
        }
    },
    twitter: function () {
        this.url.qs = function (endpoint, options) {
            // posting but not uploading
            if (options.form) {

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
