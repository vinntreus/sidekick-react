var app = require('./server/app')(__dirname);

var port = process.env.PORT || 3000;
var server = app.listen(port, function(){
    console.log('Listening on port %d', server.address().port);
});