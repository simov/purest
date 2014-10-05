
var should = require('should');
var Purest = require('../../lib/provider');


describe('instance', function () {
    it('throw error on non specified provider', function () {
        (function () {
            var p = new Purest();
        }).should.throw('Purest: provider option is required!');
    });
    it('throw error on non existing provider', function () {
        (function () {
            var p = new Purest({provider:'dood'});
        }).should.throw('Purest: non existing provider!');
    });

    it('oauth app credentials', function () {
        var p = new Purest({provider:'twitter',
            consumerKey:'app-key',
            consumerSecret:'app-secret'
        });
        p.key.should.equal('app-key');
        p.secret.should.equal('app-secret');
    });
    it('oauth app credentials through shortcuts', function () {
        var p = new Purest({provider:'twitter',
            key:'app-key', secret:'app-secret'
        });
        p.key.should.equal('app-key');
        p.secret.should.equal('app-secret');
    });
    it('oauth flag', function () {
        var p = new Purest({provider:'twitter'});
        p.oauth.should.equal(true);
    });

    it('API return data type', function () {
        var p = new Purest({provider:'twitter'});
        p.type.should.equal('');
        var p = new Purest({provider:'twitter',type:'xml'});
        p.type.should.equal('xml');
    });

    it('throw on non existing API', function () {
        (function () {
            var p = new Purest({provider:'google', api:'yahoo'});
        }).should.throw('Purest: non existing API!');
        (function () {
            var p = new Purest({provider:'twitter', api:'yahoo'});
        }).should.throw('Purest: non existing API!');
    });
    it('API name', function () {
        var p = new Purest({provider:'google', api:'plus'});
        p.api.should.equal('plus');
    });
    it.skip('APIs', function () {
        var p = new Purest({provider:'flickr'});
        console.log(p.apis);
        should.deepEqual(p.apis, {
            upload:{domain:'https://up.flickr.com',format:'path',path:'services/upload'},
            replace:{domain:'https://up.flickr.com',format:'path',path:'services/replace'}
        });
    });

    it('provider name, flag', function () {
        var p = new Purest({provider:'facebook'});
        p.facebook.should.equal(true);
        p.name.should.equal('facebook');
    });

    it('override', function () {
        var p = new Purest({provider:'linkedin'});
        var options = {form:{key:'data'}};
        p.before.post('endpoint',options);
        should.deepEqual(options, {body:'{"key":"data"}'})
    });
    it('refresh', function () {
        var p = new Purest({provider:'google'});
        p.refresh.should.be.type('function');
    });

    it.skip('support multiple instances', function () {
        var mailgun = new Purest({provider:'mailgun'}),
            sendgrid = new Purest({provider:'sendgrid'});

        mailgun.name.should.equal('mailgun');
        sendgrid.name.should.equal('sendgrid');

        var options = {form:{}};
        mailgun.before.upload('endpoint', options).should.equal(false);

        var options = {form:{files:'..'}};
        sendgrid.before.upload('endpoint', options).should.equal(true);
    });
    it.skip('config & query methods', function () {
        
    });
    it('expose the default request method', function () {
        Purest.request.should.be.type('function');
    });
});
