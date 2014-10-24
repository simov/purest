
var extend = require('extend');
var config = require('./config');


function Query (provider, name) {
    this.provider = provider;

    this.method = '';
    this.endpoint = '';
    this._options = {api:name||this.provider.api};
    this.api = this.provider.apis[name||this.provider.api];
}


// http

Query.prototype.get = function (endpoint) {
    this.method = 'get';
    this.endpoint = endpoint;
    return this;
}

Query.prototype.post = function (endpoint) {
    this.method = 'post';
    this.endpoint = endpoint;
    return this;
}

Query.prototype.put = function (endpoint) {
    this.method = 'put';
    this.endpoint = endpoint;
    return this;
}

Query.prototype.del = function (endpoint) {
    this.method = 'del';
    this.endpoint = endpoint;
    return this;
}

Query.prototype.request = function (callback) {
    return this.provider[this.method](this.endpoint, this._options, callback);
}


// http aliases

Query.prototype.select = function (endpoint) {
    return this.get(endpoint);
}

Query.prototype.update = function (endpoint) {
    return this.post(endpoint);
}

Query.prototype.create = function (endpoint) {
    return this.put(endpoint);
}

Query.prototype.insert = function (endpoint) {
    return this.put(endpoint);
}


// options

Query.prototype.headers = function (options) {
    extend(true, this._options, {headers:options});
    return this;
}

Query.prototype.qs = function (options) {
    extend(true, this._options, {qs:options});
    return this;
}

Query.prototype.form = function (options) {
    extend(true, this._options, {form:options});
    return this;
}

Query.prototype.formData = function (options) {
    extend(true, this._options, {formData:options});
    return this;
}

Query.prototype.multipart = function (options) {
    extend(true, this._options, {multipart:options});
    return this;
}

Query.prototype.options = function (options) {
    extend(true, this._options, options);
    return this;
}


// options aliases

Query.prototype.where = function (options) {
    return this.qs(options);
}

Query.prototype.set = function (options) {
    return this.form(options);
}

Query.prototype.upload = function (options) {
    return (options instanceof Array)
        ? this.multipart(options)
        : this.formData(options);
}

// obsolete
Query.prototype.files = function (files) {
    extend(true, this._options, {upload:files});
    return this;
}


// authentication

function dcopy (target, values) {
    var copy = {}, index = 0;
    (function read (target, copy) {
        for (var key in target) {
            var obj = target[key];
            if (obj instanceof Object) {
                var value = {},
                    last = add(copy, key, value);
                read(obj, last);
            } else {
                var value = obj;
                add(copy, key, value.replace('['+index+']',values[index]));
                index++;
            }
        }
    }(target, copy));
    return copy;
}
function add (copy, key, value) {
    if (copy instanceof Object) {
        copy[key] = value;
        return copy[key];
    }
}

Query.prototype.auth = function () {
    var auth = config.auth(this.endpoint, this.api.endpoints)||this.api.auth;
    if (!auth) return this;

    var options = (auth instanceof Array)
        ? auth[arguments.length-1]
        : auth;

    var result = dcopy(options, arguments);
    extend(true, this._options, result);
    return this;
}


exports = module.exports = Query;
