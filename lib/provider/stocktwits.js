
var utils = require('../utils');


function stocktwits () {

    this.options.uploadApi = {
        'messages/create': 'chart'
    }
}

exports = module.exports = stocktwits;
