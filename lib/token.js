/**
 *
 * Created by williamfligor on 10/28/14.
 */

var crypto = require('crypto');

exports.getToken = function(cb){
    crypto.randomBytes(6, function(ex, buf) {
        cb(buf.toString('hex'));
    });
};
