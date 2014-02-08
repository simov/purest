
function linkedin () {
    this.options.get = function (options, args) {
        options.headers = {'x-li-format': 'json'};
    }

    this.options.post = function (options, args) {
        options.headers = {'x-li-format': 'json'};
        options.body = JSON.stringify(args.data);
        // delete options.qs;
        delete options.form;
    }
}

exports = module.exports = linkedin;
