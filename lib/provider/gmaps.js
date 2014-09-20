
function gmaps () {

    this.options.get = function (endpoint, options) {
        if (endpoint == 'streetview' || endpoint == 'staticmap') {
            options.encoding = null;
        }
    }

    this.url.get = function (endpoint, options) {
        options = options||{};
        var match = endpoint.match(
            /(?:geocode|directions|timezone|elevation|distancematrix)(?:\/(json|xml))?/);
        if (match && !match[1]) endpoint += '/json';
        return [this.provider.domain, this.create(endpoint,options)].join('/');
    }
}

exports = module.exports = gmaps;
