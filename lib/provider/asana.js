
function asana () {

    this.options.get = function (api, options) {
        if (options.token) {
            options.headers['Authorization'] = 'Bearer '+options.token;
        }
    }

    this.options.post = function (api, options) {
        if (options.token) {
            options.headers['Authorization'] = 'Bearer '+options.token;
        }
    }
}

exports = module.exports = asana;
