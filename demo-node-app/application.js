var express = require('express');
var app = express.createServer();

app.use(express.bodyParser());

app.post('/event_search', function(req, res){
	var obj = {};
	console.log('body: ' + JSON.stringify(req.body));
	res.send(req.body);
});


app.listen(3000);