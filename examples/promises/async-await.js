
if (!process.argv[2]) {
  console.log('Specify example to run')
  process.exit()
}

import 'babel/polyfill'
import Purest from '../../'
import user from './config'


var examples = {
  0: () => {
    var p = new Purest({
      provider:'facebook',
      promise:true
    })

    async function task () {
      return await p.query()
        .get('me')
        .auth(user.facebook.token)
        .request()
    }

    task()
      .then(function (result) {
        console.log(result[0].statusCode)
        console.log(result[1])
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

examples[process.argv[2]]()
