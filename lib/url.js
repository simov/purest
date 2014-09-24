
function Url (provider) {
    this.provider = provider;

    this.path = path.call(this);
    this.create = create.call(this);
    this.domain = domain.call(this);
}

function path () {
    switch (true) {
        // version/endpoint.json
        case /twitter|mailchimp/.test(this.provider.name):
            return function (version, endpoint) {
                return [version, endpoint+'.json'].join('/');
            };

        // version/endpoint
        case (new RegExp([
                'bitly', 'linkedin', 'stackexchange', 'foursquare', 'instagram',
                'trello', 'dropbox', 'mailgun', 'box'
            ].join('|'))).test(this.provider.name):
            return function (version, endpoint) {
                return [version, endpoint].join('/');
            };

        
        // api/version/endpoint.json
        case /stocktwits|rubygems|mandrill/.test(this.provider.name):
            return function (version, endpoint) {
                return ['api', version, endpoint+'.json'].join('/');
            };

        // api/version/endpoint
        case /asana|openstreetmap/.test(this.provider.name):
            return function (version, endpoint) {
                return ['api', version, endpoint].join('/');
            };

        // api/endpoint.json
        case /sendgrid/.test(this.provider.name):
            return function (version, endpoint) {
                return ['api', endpoint+'.json'].join('/');
            };

        // api/endpoint
        case /slack/.test(this.provider.name):
            return function (version, endpoint) {
                return ['api', endpoint].join('/');
            };


        // endpoint.json
        case /soundcloud|coderbits/.test(this.provider.name):
            return function (version, endpoint) {
                return [endpoint+'.json'].join('/');
            };

        // endpoint
        case /facebook|github|wikimapia|heroku/.test(this.provider.name):
            return function (version, endpoint) {
                return [endpoint].join('/');
            };

        // path/endpoint
        case /gmaps|flickr/.test(this.provider.name):
            return function (version, endpoint) {
                return [this.provider.path, endpoint].join('/');
            }.bind(this);
    }
}

Url.prototype.api = function (endpoint, options) {
    var p = this.provider;

    var name = options.api||p.api;
    if (!name || !p.apis[name]) return;

    var api = p.apis[name],
        version = options.version||p.version||api.version,
        path = api.path||name;

    switch (true) {
        // path/version/endpoint
        // path/endpoint
        case /google/.test(p.name):
            return version
                ? [path, version, endpoint].join('/')
                : [path, endpoint].join('/');

        // version/endpoint
        case /yahoo|dropbox/.test(p.name):
            return [version, endpoint].join('/');

        // path
        case /flickr/.test(p.name):
            return path;
    }
}

function create () {
    if (this.provider.apis) {
        return function (endpoint, options) {
            var p = this.provider;

            var path = this.api(endpoint, options);
            if (path) return path;

            var version = options.version||p.version;
            return this.path(version, endpoint);
        }.bind(this);
    }
    else {
        return function (endpoint, options) {
            var p = this.provider;

            var version = options.version||p.version;
            return this.path(version, endpoint);
        }.bind(this);
    }
}

function domain () {
    if (this.provider.apis) {
        return function (options) {
            var p = this.provider;

            var name = options.api||p.api;
            return (p.apis[name] && p.apis[name].domain)
                ? p.apis[name].domain
                : p.domain;
        }.bind(this);
    }
    else {
        return function (options) {
            return this.provider.domain;
        }.bind(this);
    }
}

Url.prototype.get = function (endpoint, options) {
    options = options||{};
    return [this.domain(options), this.create(endpoint, options)].join('/');
}


exports = module.exports = Url;
