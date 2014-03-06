
function github () {

    this.options.get = function (api, options) {
        options.headers['User-Agent'] = 'TinyRest';
    }

    this.options.post = function (api, options) {
        options.headers['User-Agent'] = 'TinyRest';
    }
}

exports = module.exports = github;
