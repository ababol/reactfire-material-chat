var express = require('express');
var app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;
var host = '0.0.0.0';

app.use(express.static(__dirname));
app.listen(port, host, function() {
    console.log('reactfire-material-chat is running on ' + host + ':' + port);
});
