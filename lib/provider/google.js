
function google () {

    this.options.get = function (api, options) {
        if (options.api == 'contacts') {
            options.headers['GData-Version'] = '3.0';
            if (!options.qs.alt) options.qs.alt = 'json';
        }
    }

    this.options.post = function (api, options) {
        if (options.api == 'contacts') {
            options.headers['GData-Version'] = '3.0';
            if (!options.qs.alt) options.qs.alt = 'json';
        }
    }
}

exports = module.exports = google;
