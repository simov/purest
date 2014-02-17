
var utils = require('../utils');


function twitter () {
    this.url = function (api, args) {
        if (args.data && !args.options.upload) {
            return this.endpoint + utils.qs.call(this, api, args.data);
        } else {
            return this.endpoint + this.createPath(api);
        }
    }

    this.options.post = function (options, args) {
        // delete options.qs;
        delete options.form;
    }

    this.options.uploadApi = {
        'statuses/update_with_media': 'media[]'
    }
}

exports = module.exports = twitter;
