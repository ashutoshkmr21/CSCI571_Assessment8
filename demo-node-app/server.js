var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var https = require('https');
var geohash = require('ngeohash');
var path = require('path');

var app = express();
const port = 3000;
// var whitelistsUrl = ['http:localhost:4200'];
// var corsOpt = {
// 	origin:function(origin, callback) {
// 		var isWhiteList = whitelistsUrl.indexOf(origin) !== -1;
// 		callback(null, isWhiteList);
// 	},
// 	credentials: true
// }
// app.options('*', cors());
app.use(cors());
app.use(bodyParser());

// app.use(bodyParser.urlencoded({ extended: false , limit: '50mb'}));
app.use(express.static(path.join(__dirname, 'frontApp/dist/frontApp')));

// app.all('*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
//     next();
// });


app.post('/events', function(req, res) {
	// console.log(req);
	res.send('{"hi":"there"}');
    // let geoPoint = geohash.encode(Number(req['latitude']), Number(req['longitude']));
    // let url = 'https://app.ticketmaster.com/discovery/v2/events.json?keyword=' + 
    // encodeURIComponent(req['searchKeyword']) + '&geoPoint='+geoPoint+'&radius='+req['distance_']+
    // '&segmentId='+req['categoriesList']+'&unit=miles&apikey=ZCO9IUNBfaAyVGbG0do4Ok9v2NJHMnQQ';

    // https.get(url, res => {
    //     res.setEncoding("utf8");
    //     let body = "";
    //     res.on("data", data => {
    //       body += data;
    //     });
    //     res.on("end", () => {
    //       body = JSON.parse(body);
    //       console.log(body);
    //     });
    //   });

})
// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', '*');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

// // Request headers you wish to allow
// res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

// // Set to true if you need the website to include cookies in the requests sent
// // to the API (e.g. in case you use sessions)
// res.setHeader('Access-Control-Allow-Credentials', true);

// // Pass to next layer of middleware
// next();
// });

var route = require('./routes/route');
app.use('/api', route);

// app.get('*', function(req, res) {
//     res.redirect('/#' + req.originalUrl);
//   });

// app.get('/', (req, res) => {
// 	res.send('hi there!!');
// });

app.listen(port, () => {
	console.log("Server started at port " + port);
});