
function github () {

    this.options.get = function (api, options) {
        options.headers['User-Agent'] = 'purest';
    }

    this.options.post = function (api, options) {
        options.headers['User-Agent'] = 'purest';
    }
}

exports = module.exports = github;
