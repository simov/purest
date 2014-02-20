
function github () {

    this.options.get = function (options, args) {
        options.headers = {'User-Agent': 'TinyRest'};
    }

    this.options.post = function (options, args) {
        options.headers = {'User-Agent': 'TinyRest'};
    }
}

exports = module.exports = github;
