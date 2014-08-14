
function github () {

    this.options.get = function (api, options) {
        if (!options.headers['User-Agent'])
            options.headers['User-Agent'] = 'Purest';
    }

    this.options.post = function (api, options) {
        if (!options.headers['User-Agent'])
            options.headers['User-Agent'] = 'Purest';
    }
}

exports = module.exports = github;
