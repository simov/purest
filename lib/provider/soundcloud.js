
function soundcloud () {

    // soundcloud doensn't like content-type
    this.options.afterMultipart = function (provider, endpoint, options) {
        for (var i=0; i < options.multipart.length; i++) {
            delete options.multipart[i]['content-type'];
        }
    }
}

exports = module.exports = soundcloud;
