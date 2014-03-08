
var utils = require('../utils');

var c = {
    upload: require('../../config/upload').twitter
};

function twitter () {
    
    this.options.get = function (api, options) {
        this.options.oauth.call(this, options);
    }

    this.options.post = function (api, options) {
        this.options.oauth.call(this, options);
    }

    this.url = function (api, options) {
        // posting but not uploading
        if (options.form && !c.upload[api]) {
            var path = this.domain + utils.qs.call(this, api, options.form);
            delete options.form;
            return path;
        }
        // get
        else {
            return this.domain + this.createPath(api);
        }
    }
}

exports = module.exports = twitter;
