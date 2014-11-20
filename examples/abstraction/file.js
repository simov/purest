
var Purest = require('../../lib/provider')

var box = new Purest({provider:'box'}),
  dropbox = new Purest({provider:'dropbox'})

var cred = {
  app: require('../../config/app'),
  user: require('../../config/user')
}


function move (id, name, done) {
  box.query()
    .get('files/'+id+'/content')
    .auth(cred.user.box.token)
    .request()
    .pipe(dropbox.query('files')
      .put('files_put/auto/'+name)
      .auth(cred.user.dropbox.token)
      .request()
      .on('end', done))

}

move('21838973235', 'image1.jpg', function () {
  console.log('DONE!')
})
