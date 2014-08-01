
var apis = require('../../config/providers').yahoo.api;


function yahoo () {

    this.options.get = function (api, options) {
        if (options.oauth)
            this.options.oauth.call(this, options);
    }

    this.options.post = function (api, options) {
        this.options.oauth.call(this, options);
    }
}

exports = module.exports = yahoo;
