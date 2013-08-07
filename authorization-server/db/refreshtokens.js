//TODO Document all of this

var tokens = {};


exports.find = function(key, done) {
    var token = tokens[key];
    return done(null, token);
};

exports.save = function(token, userID, clientID, scope, done) {
    tokens[token] = { userID: userID, clientID: clientID, scope: scope};
    return done(null);
};

exports.delete = function(key, done) {
    delete tokens[key];
    return done(null);
}
