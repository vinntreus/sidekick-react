var express = require('express');
var compress = require('compression');
var pjson = require('./package.json');

var fs = require('fs');

//process.env.NODE_ENV = 'production';

var env = process.env.NODE_ENV === 'production' ? '.min' : '';
var version = pjson.version;
var app = express();

app.use(compress());
app.use(express.static(__dirname + '/dist'));

app.get('/', function(req, res){
    fs.readFile('./ui/index.html',{ encoding: 'utf8' }, function (err, data) {
      var page = data.replace(/\[ENV\]/g, env);
      page = page.replace(/\[VERSION\]/g, version);
      res.send(err || page);
    });
});

app.get('/data.json', function(req, res){
    res.send([
        {"name": "Pete Hunt", "text": "This is one comment"}
    ]);
});

var port = process.env.PORT || 3000;
var server = app.listen(port, function(){
    console.log('Listening on port %d', server.address().port);
});