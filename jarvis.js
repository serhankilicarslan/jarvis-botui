var express = require('express'),
    path = __dirname +'/src/'
var app = express();

//Set content directories
app.use(express.static('src'));

app.get('/', function(request, response) {
    response.sendfile(path + 'index.html');
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});