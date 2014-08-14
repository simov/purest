
var utils = require('../utils');

var c = {
    upload: require('../../config/upload').twitter
};

function twitter () {

    this.url = function (api, options) {
        options = options||{};
        // posting but not uploading
        if (options.form && !c.upload[api]) {
            var path = [this.domain, utils.qs.call(this, api, options.form)].join('/');
            delete options.form;
            return path;
        }
        // get
        else {
            return [this.domain, this.createPath(api, options)].join('/');
        }
    }
}

exports = module.exports = twitter;
