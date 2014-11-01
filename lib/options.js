
function Options (provider) {
    this.provider = provider;
}

Options.prototype.oauth = function (options) {
    options.oauth = options.oauth||{};
    options.oauth = {
        consumer_key: options.oauth.consumer_key||this.provider.key,
        consumer_secret: options.oauth.consumer_secret||this.provider.secret,
        token: options.oauth.token,
        token_secret: options.oauth.secret||options.oauth.token_secret
    }
    if (!options.oauth.consumer_key || !options.oauth.consumer_secret ||
        !options.oauth.token || !options.oauth.token_secret)
        throw new Error('Missing OAuth credentials!');
}

// overrides

function Before (provider) {
    this.provider = provider;
}
Before.prototype.get = function (endpoint, options) {}
Before.prototype.post = function (endpoint, options) {}
Before.prototype.put = function (endpoint, options) {}
Before.prototype.del = function (endpoint, options) {}

function After (provider) {
    this.provider = provider;
}
After.prototype.get = function (endpoint, options) {}
After.prototype.post = function (endpoint, options) {}
After.prototype.put = function (endpoint, options) {}
After.prototype.del = function (endpoint, options) {}


exports.Options = Options;
exports.Before = Before;
exports.After = After;
