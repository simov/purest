
function mailchimp () {

    this.url = function (endpoint, options) {

        // options or apikey
        if (options.dc || /.*-\w{2}\d+/.test(options.qs.apikey)) {
            var dc = options.dc
                ? options.dc
                : options.qs.apikey.replace(/.*-(\w{2}\d+)/,'$1');
            return [
                this.domain.replace('dc', dc),
                this.createPath(endpoint, options)
            ].join('/');
        }
        // token
        else throw new Error('Purest: specify data center to use through the dc option!');
    }
}

exports = module.exports = mailchimp;
