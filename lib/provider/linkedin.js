
function linkedin () {

    this.options.get = function (api, options) {
        options.oauth = options.oauth||{};
        options.oauth = {
            consumer_key: this.consumerKey||options.oauth.consumer_key,
            consumer_secret: this.consumerSecret||options.oauth.consumer_secret,
            token: options.oauth.token,
            token_secret: options.oauth.secret||options.oauth.token_secret
        }
        options.headers['x-li-format'] = 'json';
    }

    this.options.post = function (api, options) {
        options.oauth = options.oauth||{};
        options.oauth = {
            consumer_key: this.consumerKey||options.oauth.consumer_key,
            consumer_secret: this.consumerSecret||options.oauth.consumer_secret,
            token: options.oauth.token,
            token_secret: options.oauth.secret||options.oauth.token_secret
        }
        options.headers['x-li-format'] = 'json';
        options.body = JSON.stringify(options.form||{});
        delete options.form;
    }
}

exports = module.exports = linkedin;
