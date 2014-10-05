
var extend = require('extend');


function Query (provider) {
    this.provider = provider;
}

// create

Query.prototype.config = function (name) {
    this.method = '';
    this.endpoint = '';
    this._options = {api:name||this.provider.api};
    this.api = this.provider.apis[name||this.provider.api];
}

Query.prototype.query = function (name) {
    this.config(name);
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

// options

Query.prototype.qs = function (options) {
    extend(true, this._options, {qs:options});
    return this;
}

Query.prototype.form = function (options) {
    extend(true, this._options, {form:options});
    return this;
}

Query.prototype.headers = function (options) {
    extend(true, this._options, {headers:options});
    return this;
}

Query.prototype.options = function (options) {
    extend(true, this._options, options);
    return this;
}

// aliases

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

Query.prototype.where = function (options) {
    return this.qs(options);
}

Query.prototype.set = function (options) {
    return this.form(options);
}

// auth

Query.prototype.auth = function () {
    if (!this.api.auth) return this;

    var options =  (this.api.auth instanceof Array)
        ? this.api.auth[arguments.length-1]
        : this.api.auth;

    var handle = Object.keys(options)[0],
        keys = options[handle],
        idx = 0,
        obj = {};
    for (var key in keys) {
        var value = arguments[idx];
        obj[key] = keys[key].replace('['+idx+']', value);
        idx++;
    }
    var result = {};
    result[handle] = obj;

    extend(true, this._options, result);
    return this;
}

// misc

Query.prototype.upload = function (files) {
    extend(true, this._options, {upload:files});
    return this;
}

Query.prototype.multipart = function (files) {
    // not implemented
    return this;
}


exports = module.exports = Query;
