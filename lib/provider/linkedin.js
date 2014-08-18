
function linkedin () {

    this.options.get = function (endpoint, options) {
        if (!options.headers['x-li-format'])
            options.headers['x-li-format'] = 'json';
    }

    this.options.post = function (endpoint, options) {
        if (!options.headers['x-li-format'])
            options.headers['x-li-format'] = 'json';
        
        options.body = JSON.stringify(options.form||{});
        delete options.form;
    }
}

exports = module.exports = linkedin;
