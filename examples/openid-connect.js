
var purest = require('../')
var jws = require('jws')
var pem = require('jwk-to-pem')

// ----------------------------------------------------------------------------

var auth = {
  auth0: {
    // scope: openid
    id_token: '',
    // tenant or tenant.region
    subdomain: '',
  },
  google: {
    // scope: openid
    id_token: '',
  },
  microsoft: {
    // scope: openid
    id_token: '',
  },
}

// ----------------------------------------------------------------------------

var config = {
  "auth0": {
    "discovery": {
      "origin": "https://{subdomain}.auth0.com",
      "path": ".well-known/openid-configuration"
    }
  },
  "google": {
    "discovery": {
      "origin": "https://accounts.google.com",
      "path": ".well-known/openid-configuration"
    }
  },
  "microsoft": {
    "discovery": {
      "origin": "https://login.microsoftonline.com",
      "path": "common/v2.0/.well-known/openid-configuration"
    }
  }
}

// ----------------------------------------------------------------------------

var verify = ({id_token, jwk}) => {
  var jwt = jws.decode(id_token)
  console.log(jwt)
  var key = jwk.keys.find(({kid}) => kid === jwt.header.kid)
  return jws.verify(id_token, jwt.header.alg, pem(key))
}

;({

  'auth0 verify': async () => {
    var auth0 = purest({provider: 'auth0', config, defaults: {
      subdomain: auth.auth0.subdomain
    }})

    var {body:doc} = await auth0('discovery').request()
    var {body:jwk} = await auth0.get(doc.jwks_uri).request()

    var valid = verify({id_token: auth.auth0.id_token, jwk})
    console.log(valid ? 'Valid id_token!' : 'Invalid id_token!')
  },

  'google verify': async () => {
    var google = purest({provider: 'google', config})

    var {body:doc} = await google('discovery').request()
    var {body:jwk} = await google.get(doc.jwks_uri).request()

    var valid = verify({id_token: auth.google.id_token, jwk})
    console.log(valid ? 'Valid id_token!' : 'Invalid id_token!')
  },

  'microsoft verify': async () => {
    var microsoft = purest({provider: 'microsoft', config})

    var {body:doc} = await microsoft('discovery').request()
    var {body:jwk} = await microsoft.get(doc.jwks_uri).request()

    var valid = verify({id_token: auth.microsoft.id_token, jwk})
    console.log(valid ? 'Valid id_token!' : 'Invalid id_token!')
  },

})[process.argv[2]]()
