
var cred = require('../../test/credentials');


exports = module.exports = function (t) {
    return {
        // get account profile
        0: function () {
            var fields = ':(id,first-name,last-name,formatted-name,headline,picture-url,auth-token,distance,num-connections)';
            t.get('people/~'+fields, {
                options:{
                    token:cred.user.linkedin.token,
                    secret:cred.user.linkedin.secret
                }
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        // get company page profile
        1: function (id) {
            var fields = ':(id,name,universal-name,logo-url,square-logo-url,num-followers)';
            t.get('companies/'+id+fields, {
                options:{
                    token:cred.user.linkedin.token,
                    secret:cred.user.linkedin.secret
                }
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        // get group profile
        2: function (id) {
            var fields = ':(id,name,num-members,small-logo-url,large-logo-url)';
            t.get('groups/'+id+fields, {
                option:{
                    token:cred.user.linkedin.token,
                    secret:cred.user.linkedin.secret
                }
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        // list company pages
        3: function () {
            var fields = ':(id,name,universal-name,logo-url,square-logo-url)';
            t.get('companies'+fields, {
                options:{
                    token:cred.user.linkedin.token,
                    secret:cred.user.linkedin.secret
                },
                params:{
                    'is-company-admin':true
                }
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        // list groups
        4: function () {
            var fields = ':(group:(id,name,num-members,small-logo-url,large-logo-url))';
            t.get('people/~/group-memberships'+fields, {
                options:{
                    token:cred.user.linkedin.token,
                    secret:cred.user.linkedin.secret
                },
                params: {
                    // 'membership-state':'owner',
                    // 'membership-state':'manager',
                    // 'membership-state':'member',
                    count:25
                }
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        // get user's updates
        5: function (id) {
            var fields = ':(timestamp,update-key,update-type,update-content:(person:(id,first-name,last-name,formatted-name,headline,picture-url,auth-token,distance,connections,current-share,main-address,twitter-accounts,im-accounts,phone-numbers,date-of-birth,member-groups)),updated-fields,is-commentable,update-comments,is-likable,is-liked,num-likes)';
            t.get('people/'+(id||'~')+'/network/updates'+fields, {
                options:{
                    token:cred.user.linkedin.token,
                    secret:cred.user.linkedin.secret
                },
                params: {
                    type:'SHAR',
                    scope:'self',
                    count:25
                }
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        // get user's first-degree connection updates
        6: function (id) {
            var fields = ':(timestamp,update-key,update-type,update-content:(person:(id,first-name,last-name,formatted-name,headline,picture-url,auth-token,distance,connections,current-share,main-address,twitter-accounts,im-accounts,phone-numbers,date-of-birth,member-groups)),updated-fields,is-commentable,update-comments,is-likable,is-liked,num-likes)';
            t.get('people/'+(id||'~')+'/network/updates'+fields, {
                options:{
                    token:cred.user.linkedin.token,
                    secret:cred.user.linkedin.secret
                },
                params:{
                    type:'SHAR',
                    count:25
                }
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        // get company page updates
        7: function (id) {
            var fields = ':(timestamp,updateType,updateContent,updateKey,isCommentable,likes,updateComments)';
            t.get('companies/'+id+'/updates'+fields, {
                options:{
                    token:cred.user.linkedin.token,
                    secret:cred.user.linkedin.secret
                },
                params:{
                    'event-type':'status-update',
                    start:0,
                    count:5
                }
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        // get group updates
        8: function (id) {
            t.get('groups/'+id+'/posts', {
                options:{
                    token:cred.user.linkedin.token,
                    secret:cred.user.linkedin.secret
                },
                params:{count:5}
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        // post user share
        9: function () {
            t.post('people/~/shares', {
                options:{
                    token:cred.user.linkedin.token,
                    secret:cred.user.linkedin.secret
                },
                data:{
                    comment:'Publish message on '+new Date(),
                    visibility:{code:'anyone'}
                }
            },
            function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        // post company page share
        10: function (id) {
            t.post('companies/'+id+'/shares', {
                options:{
                    token:cred.user.linkedin.token,
                    secret:cred.user.linkedin.secret
                },
                data:{
                    comment:'Publish message on '+new Date(),
                    visibility:{code:'anyone'}
                }
            },
            function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        // post group share
        11: function (id) {
            t.post('groups/'+id+'/posts', {
                options:{
                    token:cred.user.linkedin.token,
                    secret:cred.user.linkedin.secret
                },
                data:{
                    title:'Publish message on '+new Date(),
                    summary:' '
                }
            },
            function (err, res, body) {
                debugger;
                console.log(body);
            });
        }
    };
}
