
function Options (provider) {
  this.provider = provider
}

Options.prototype.oauth = function (options) {
  var oa = options.oauth = options.oauth||{}

  oa.consumer_key = oa.consumer_key||this.provider.key
  oa.consumer_secret = oa.consumer_secret||this.provider.secret
  // oa.token = oa.token
  oa.token_secret = oa.secret||oa.token_secret
  delete oa.secret

  if (!oa.consumer_key || !oa.consumer_secret ||
      !oa.token || !oa.token_secret) {
    throw new Error('Purest: Missing OAuth credentials!')
  }
}

// overrides

function Before (provider) {
  this.provider = provider
}
Before.prototype.all = function (endpoint, options) {}
Before.prototype.get = function (endpoint, options) {}
Before.prototype.post = function (endpoint, options) {}
Before.prototype.put = function (endpoint, options) {}
Before.prototype.del = function (endpoint, options) {}
Before.prototype.patch = function (endpoint, options) {}
Before.prototype.head = function (endpoint, options) {}


exports.Options = Options
exports.Before = Before
