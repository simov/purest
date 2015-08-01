
if (!process.argv[2]) return console.log('Specify example to run')

var app = require('../../config/app').google || {}
  , user = require('../../config/user').google || {}
var p = new (require('../../'))({provider:'google'})


var examples = {
  // get all google contact's groups
  0: function () {
    p.query('contacts')
      .select('groups/default/full')
      .where({'max-results':50})
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get google contacts from specific group
  1: function () {
    p.query('contacts')
      .select('contacts/default/full')
      .where({
        // group:'http://www.google.com/m8/feeds/groups/email%40gmail.com/base/[ID]',
        'max-results':50
      })
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // google contacts pagination
  2: function () {
    function next (link) {
      for (var i=0; i < link.length; i++) {
        if (link[i].rel == 'next') {
          return parseInt(
            link[i].href.replace(/.*start-index=(\d+).*/,'$1')
          , 10)
        }
      }
      return false
    }
    var contacts = []
    ;(function page (index, done) {
      p.query('contacts')
        .select('contacts/default/full')
        .where({
          'start-index':index,
          'max-results':50
        })
        .auth(user.token)
        .request(function (err, res, body) {
          debugger
          if (err) return done(err)
          contacts = contacts.concat(body.feed.entry)
          var index = next(body.feed.link)
          console.log(index)
          if (index) return page(index, done)
          done()
        })
    }(1, function (err) {
      debugger
      if (err) throw err
      console.log(contacts.length)
    }))
  },

  // get a single message
  3: function () {
    p.query('gmail')
      .select('users/me/messages/14b2d0a9cd8a439f')
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get a single thread
  4: function () {
    p.query('gmail')
      .select('users/me/threads/14b2d0a9cd8a439f')
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },

  // search for a file
  5: function () {
    p.query('drive')
      .select('files')
      .where({q:"title = 'cat.png' and trashed = false"})
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },

  // youtube/analytics
  6: function () {
    p.query('youtube/analytics')
      .select('reports')
      .where({
        ids:'channel==UCar6nMFGfuv254zn5vDyVaA',
        metrics:'views',
        'start-date':'2014-01-15',
        'end-date':'2014-02-15'
      })
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // freebase
  7: function () {
    p.query('freebase')
      .select('search')
      .where({query:'Thriftworks'})
      .auth(user.token)
      // .options({json:true})
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // tasks
  8: function () {
    p.query('tasks')
      .select('users/@me/lists')
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // urlshortener
  9: function () {
    p.query('urlshortener')
      .select('url')
      .where({shortUrl:'http://goo.gl/0wkZ4V'})
      .auth(user.apikey)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // pagespeed
  10: function () {
    p.query('pagespeedonline')
      .select('runPagespeed')
      .where({url:'http://www.amazon.com/'})
      .auth(user.apikey)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },

  // gmaps - streetview
  11: function () {
    p.query('gmaps')
      .get('streetview')
      .where({
        location:'40.7828647,-73.9653551',
        size:'400x400',
        sensor:false
      })
      .auth(user.apikey)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        if (res.statusCode == 200) {
          require('fs').writeFileSync('streetview.jpg', body, 'binary')
        }
      })
  },
  // gmaps - staticmap
  12: function () {
    p.query('gmaps')
      .get('staticmap')
      .where({
        center:'40.7828647,-73.9653551',
        size:'640x640',
        zoom:15,
        format:'jpg',
        sensor:false
      })
      .auth(user.apikey)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        if (res.statusCode == 200) {
          require('fs').writeFileSync('staticmap.jpg', body, 'binary')
        }
      })
  },
  // gmaps - geocode
  13: function () {
    p.query('gmaps')
      .get('geocode/json')
      .where({
        address:'Central Park, New York, NY',
        sensor:false
      })
      .auth(user.apikey)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // gmaps - directions
  14: function () {
    p.query('gmaps')
      .get('directions/json')
      .where({
        origin:'Central Park, New York, NY',
        destination:'New York, New Jersey',
        sensor:false
      })
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // gmaps - timezone
  15: function () {
    p.query('gmaps')
      .select('timezone/json')
      .where({
        location:'40.7828647,-73.9653551',
        timestamp:'1331161200',
        sensor:false
      })
      .auth(user.apikey)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // gmaps - elevation
  16: function () {
    p.query('gmaps')
      .get('elevation/json')
      .where({
        locations:'40.7828647,-73.9653551',
        sensor:false
      })
      .auth(user.apikey)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // gmaps - distancematrix
  17: function () {
    p.query('gmaps')
      .get('distancematrix/json')
      .where({
        origins:'40.7828647,-73.9653551',
        destinations:'40.7873463,-74.0108939',
        sensor:false
      })
      .auth(user.apikey)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  }
}

examples[process.argv[2]]()
