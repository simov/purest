
function github () {

    this.options.get = function (api, options) {
        options.headers['User-Agent'] = 'Purest';
    }

    this.options.post = function (api, options) {
        options.headers['User-Agent'] = 'Purest';
    }
}

exports = module.exports = github;
