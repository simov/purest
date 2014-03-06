
function gmaps () {

    this.options.get = function (api, options) {
        if (api == 'streetview' || api == 'staticmap') {
            options.encoding = null;
        }
    }

    this.url = function (api, options) {
        var match = api.match(/(?:geocode|directions|timezone|elevation|distancematrix)(?:\/(json|xml))?/);
        if (match && !match[1]) api += '/json';
        return this.domain + this.createPath(api);
    }
}

exports = module.exports = gmaps;
