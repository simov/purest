
var compose = require('request-compose')
var oauth = require('request-oauth')
var multipart = require('request-multipart')
var qs = require('qs')

var parse = () => ({options, res, res: {headers}, body, raw}) => {

  raw = body

  var header = Object.keys(headers)
    .find((name) => name.toLowerCase() === 'content-type')

  if (/json|javascript/.test(headers[header])) {
    try {
      body = JSON.parse(body)
    }
    catch (err) {}
  }

  else if (/application\/x-www-form-urlencoded/.test(headers[header])) {
    try {
      body = qs.parse(body) // use qs instead of querystring for nested objects
    }
    catch (err) {}
  }

  log({parse: {res, body}})

  return {options, res, body, raw}
}

var log = (data) => {
  if (process.env.DEBUG) {
    try {
      require('request-logs')(data)
    }
    catch (err) {}
  }
}

module.exports = compose.extend({
  Request: {oauth, multipart},
  Response: {parse}
})
