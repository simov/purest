
var provider = {
  box: require('./provider/box'),
  dropbox: require('./provider/dropbox'),
  drive: require('./provider/drive'),
  onedrive: require('./provider/onedrive')
}

function Storage (options) {
  if (!provider[options.provider]) {
    throw new Error('Non existing provider!')
  }
  var storage
  if (options.provider == 'drive') {
    storage = options.provider
    options.provider = 'google'
    options.api = 'drive'
  }
  else if (options.provider == 'onedrive') {
    storage = options.provider
    options.provider = 'live'
  }
  else {
    storage = options.provider
  }
  return new provider[storage](options)
}

exports = module.exports = Storage
