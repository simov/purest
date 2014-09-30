
var should = require('should');
var config = require('../../lib/config');


var fixtures = {
    provider: {
        __provider: {
            oauth: true,
            refresh: '',
            docs: ''
        },
        'https://domain.com': {
            'api/[version]/{endpoint}.[type]': {
                __path: {
                    alias: ['__default'],
                    version: 'v3'
                },
                '*': {
                    all: {
                        headers: {
                            'x-li-format': 'json'
                        }
                    }
                },
                'documents': {
                    get: {
                        options: {
                            encoding: null
                        }
                    }
                },
                'files\\/\\d+\\/content': {
                    __endpoint: {
                        regex: true
                    },
                    post: {
                        multipart: 'file'
                    }
                }
            }
        }
    },
    alias: {
        __default: {
            domain: 'https://domain.com',
            path: 'api/[version]/{endpoint}.[type]',
            version: 'v3',
            endpoints: {
                all: {
                    'all': {
                        headers: {
                            'x-li-format': 'json'
                        }
                    }
                },
                str: {
                    'documents': {
                        get: {
                            options: {
                                encoding: null
                            }
                        }
                    }
                },
                regex: {
                    'files\\/\\d+\\/content': {
                        __endpoint: {
                            regex: true
                        },
                        post: {
                            multipart: 'file'
                        }
                    }
                }
            }
        }
    }
};


describe('config', function () {
    
    it('aliases', function () {
        should.deepEqual(config.aliases(fixtures.provider), fixtures.alias);
    });

    it('options', function () {
        var endpoints = fixtures.alias.__default.endpoints;

        should.deepEqual(
            config.options('files', {}, 'get', endpoints),
            { headers: { 'x-li-format': 'json' } }
        );
        should.deepEqual(
            config.options('documents', {}, 'get', endpoints),
            { headers: { 'x-li-format': 'json' }, options: { encoding: null } }
        );
        should.deepEqual(
            config.options('files/123/content', {}, 'post', endpoints),
            { headers: { 'x-li-format': 'json' }, multipart: 'file' }
        );
        var options = {headers:{'User-Agent':'Grant', 'x-li-format':'xml'}};
        should.deepEqual(
            config.options('files', options, 'get', endpoints),
            { headers: { 'x-li-format': 'xml', 'User-Agent': 'Grant' } }
        );
    });
});
