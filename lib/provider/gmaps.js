
function gmaps () {

    this.options.get = function (endpoint, options) {
        if (endpoint == 'streetview' || endpoint == 'staticmap') {
            options.encoding = null;
        }
    }

    this.url = function (endpoint, options) {
        var match = endpoint.match(
            /(?:geocode|directions|timezone|elevation|distancematrix)(?:\/(json|xml))?/);
        if (match && !match[1]) endpoint += '/json';
        return [this.domain, this.createPath(endpoint)].join('/');
    }
}

exports = module.exports = gmaps;
