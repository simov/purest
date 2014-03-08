
var apis = require('../../config/providers').yahoo.api;


function yahoo () {

    this.options.get = function (api, options) {
        if (options.oauth)
            this.options.oauth.call(this, options);
    }

    this.options.post = function (api, options) {
        this.options.oauth.call(this, options);
    }
    
    this.url = function (api, options) {
        return apis[options.api||this.api].domain + this.createPath(api, options);
    }
}

exports = module.exports = yahoo;
