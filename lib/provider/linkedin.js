
function linkedin () {

    this.options.get = function (api, options) {

        options.headers['x-li-format'] = 'json';
    }

    this.options.post = function (api, options) {

        options.headers['x-li-format'] = 'json';
        options.body = JSON.stringify(options.form||{});
        delete options.form;
    }
}

exports = module.exports = linkedin;
