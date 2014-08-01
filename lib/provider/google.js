
function google () {

    this.options.get = function (api, options) {
        if (options.api == 'm8/feeds/contacts') {
            options.headers['GData-Version'] = '3.0';
        }
    }

    this.options.post = function (api, options) {
        if (options.api == 'm8/feeds/contacts') {
            options.headers['GData-Version'] = '3.0';
        }
    }
}

exports = module.exports = google;
