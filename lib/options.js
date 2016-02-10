
module.exports = (provider) => {

  function oauth (options) {
    var oa = options.oauth || {}

    if (oa.consumer_key || provider.key) {
      oa.consumer_key = oa.consumer_key || provider.key
    }
    if (oa.consumer_secret || provider.secret) {
      oa.consumer_secret = oa.consumer_secret || provider.secret
    }

    if (oa.token) {
      oa.token = oa.token
    }
    if (oa.secret || oa.token_secret) {
      oa.token_secret = oa.secret || oa.token_secret
    }

    delete oa.secret

    // hackpad
    if (Object.keys(oa).length) {
      options.oauth = oa
    }
  }

  function parse (options) {
    if (options.parse === undefined) {
      options.parse = {json: true}
    }
    else if (options.parse.json === undefined) {
      options.parse.json = true
    }
  }

  return {oauth, parse}
}
