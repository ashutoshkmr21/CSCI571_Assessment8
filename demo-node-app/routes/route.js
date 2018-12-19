var express = require('express');
const axios = require('axios');
var geohash = require('ngeohash');
const https = require('https');
var bodyParser = require('body-parser');
var req_hit = require('request-promise');
var SpotifyWebApi = require('spotify-web-api-node');
var moment = require('moment');

var router = express.Router();
var app = express();
app.use(bodyParser());

//custom search API key = 002572066580063025489:hloys2tdmrs
//Google API Key =  AIzaSyCigs2M4100H8llGDvBFRUiN8RzSoBZIQc


//update google api key = AIzaSyC_j5R5fxbt6jhnMyUGv_GcNf_xb3RENPI
//updated custom search key = 001941704238005507175:y0dzhm2jppm

router.get('/test', (req, res) => {
    res.send('{"hi":"there"}');
})

// export async function getResponse(params) {
//     const res = await axios.get(params);
//     return JSON.stringify(res.data);
// } 



router.get('/google-search-img', (req, res) => {
    let cx = '001941704238005507175:y0dzhm2jppm';
    let url = 'https://www.googleapis.com/customsearch/v1?q=' + encodeURIComponent(req.query.key) + '&cx=' + encodeURIComponent(cx) + '&imgSize=huge&imgType=news&num=9&searchType=image&key=AIzaSyC_j5R5fxbt6jhnMyUGv_GcNf_xb3RENPI';
    let body = getContent(url);
    body.then(function(data) {
        res.header("Content-Type",'application/json');
        // console.log(data);

        let res1 = data["items"];
        let count = 0;
        let links = []
        let tup = {};
        for (var dat of res1) {
            if (count > 7) {
              break;
            }
            links.push(dat["link"]);
            count++;
        }
        tup.name = req.query.key;
        tup.links = links;
        res.send(JSON.stringify(tup));
      }).catch(err => {
        console.log(err);
        res.status(503).send(err);
      })
})


// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: 'ae0d892f16624222b7b687814cdd8cfb',
  clientSecret: '563ce176ff154119a9d3e0a4e3aaa197'
});

router.get('/get-artist', (req, res) => {
    // setSpotifyToken();
    // resp = getAPIResponse(req);
    // res.send(resp);
    let key = req.query.key;
    spotifyApi.clientCredentialsGrant().then(
        function(data) {
          console.log('The access token expires in ' + data.body['expires_in']);
          console.log('The access token is ' + data.body['access_token']);
      
          // Save the access token so that it's used in future calls
          spotifyApi.setAccessToken(data.body['access_token']);
        },
        function(err) {
          console.log('Something went wrong when retrieving an access token', err);
        }
      ).then(function(data){
          console.log(key);
        spotifyApi.searchArtists(key)
        .then(function(data) {
            // console.log('Search artists by "Love"', data.body);
            var tup = {};
            try {
                var res1 = data.body;
                // console.log(res);
                tup.name = res1["artists"]["items"][0]["name"];
                tup.follower = res1["artists"]["items"][0]["followers"]["total"];
                tup.popularity = res1["artists"]["items"][0]["popularity"];
                tup.checkAt = res1["artists"]["items"][0]["external_urls"]["spotify"];
    
                // response.push(tup);
              } catch (err) {
                console.log(err);
              }

            res.send(JSON.stringify(tup));
            // return data.body;
        }, function(err) {
            console.error(err);
    });
      });
})

function getAPIResponse(req) {
    return setSpotifyToken(req.query.key);
    // let prom = [setSpotifyToken(req.query.key)];
    // Promise.all(prom).then(function(data){
    //     spotifyApi.searchArtists(encodeURIComponent(req.query.key))
    //             .then(function(data) {
    //                 console.log('Search artists by "Love"', data.body);
    //                 return data.body;
    //             }, function(err) {
    //                 console.error(err);
    //     });
    // });
    // spotifyApi.searchArtists(encodeURIComponent(req.query.key))
    //     .then(function(data) {
    //         console.log('Search artists by "Love"', data.body);
    //         // res.send(data.body);
    //         return data.body;
    //     }, function(err) {
    //         console.error(err);
    //         // setSpotifyToken();
    //         // spotifyApi.searchArtists(encodeURIComponent(req.query.key))
    //         //     .then(function(data) {
    //         //         console.log('Search artists by "Love"', data.body);
    //         //         res.send(data.body);
    //         //     }, function(err) {
    //         //         console.error(err);
    //         // });
    // });
}

function setSpotifyToken(key) {
    // console.log(key);
    spotifyApi.clientCredentialsGrant().then(
        function(data) {
          console.log('The access token expires in ' + data.body['expires_in']);
          console.log('The access token is ' + data.body['access_token']);
      
          // Save the access token so that it's used in future calls
          spotifyApi.setAccessToken(data.body['access_token']);
        },
        function(err) {
          console.log('Something went wrong when retrieving an access token', err);
        }
      ).then(function(data){
        //   console.log(key);
        spotifyApi.searchArtists(encodeURIComponent(key))
        .then(function(data) {
            // console.log('Search artists by "Love"', data.body);
            // res.send(data.body);
            return data.body;
        }, function(err) {
            console.error(err);
    });
      });
}

router.get('/upcoming-events', (req, res) => {
    let url = 'https://api.songkick.com/api/3.0/search/venues.json?query=' + encodeURIComponent(req.query.key) + '&apikey=uslmcwFhfNNpljVm';
    let body = getContent(url);
    // let resp = body['resultsPage']['results']['venue'][0]['id'];
    // console.log('id for songkick venue is ' +  resp);
    let resp;
    body.then(function(data) {
        res.header("Content-Type",'application/json');
        // console.log(data);
        resp = data;
        let id = resp['resultsPage']['results']['venue'][0]['id'];
        url = 'https://api.songkick.com/api/3.0/venues/' + id + '/calendar.json?apikey=uslmcwFhfNNpljVm';
        let subbody = getContent(url);
        subbody.then(function(dat1){
            res.header("Content-Type",'application/json');

            let response = [];
            try {
                let res = dat1["resultsPage"]["results"]["event"];
                // console.log(res);
                    for (var dat of res) {
                      let tup = {};
                      try {
                        if (dat["displayName"]) {
                          tup.name = dat["displayName"];
                        } else {
                          continue;
                        }
                        tup.url = dat["uri"];
                        tup.artistName = dat["performance"][0]["displayName"];
                        let dateTime = "";
                        let dateString = "";
                        if (dat["start"]["date"]){
                          tup.date = dat["start"]["date"];
                          dateTime += tup.date;
                          dateString = moment(dateTime, "YYYY-MM-DD").format("MMM DD, YYYY");
                        }
                        if (dat["start"]["time"]) {
                          tup.time = dat["start"]["time"];
                          dateTime += ' ' + tup.time;
                          dateString = moment(dateTime, "YYYY-MM-DD HH:mm:ss").format("MMM D, YYYY HH:mm:ss");
                        }
                        tup.dateString = dateString;
                        tup.type = dat.type;
                        response.push(tup);
                      } catch (err) {
                        console.log(err);
                      }
        
                    }
                
              } catch (err) {
                console.log(err);
              }

            res.send(JSON.stringify(response));
        }).catch(err => {
            console.log(err);
            res.status(503).send(err);
        })
        // console.log(resp);
        // res.send(JSON.stringify(data));
      }).catch(err => {
        console.log(err);
        res.status(503).send(err);
      })
})

router.get('/venue-details', (req, res) => {
    let url = 'https://app.ticketmaster.com/discovery/v2/venues?apikey=ZCO9IUNBfaAyVGbG0do4Ok9v2NJHMnQQ&keyword=' + encodeURIComponent(req.query.key);
    let body = getContent(url);
    body.then(function(data) {
        res.header("Content-Type",'application/json');
        // console.log(data);
        let tup = {};
        try {
            let res = data["_embedded"]["venues"][0];
            tup.venue = req.query.key;
            tup.venueAddress = res['address']['line1'];
            tup.venueCity = res['city']['name'] + ' ' + res['state']['name'];
            if (res['boxOfficeInfo']['phoneNumberDetail']) {
              tup.venuePhNo = res['boxOfficeInfo']['phoneNumberDetail'].split(":")[1];
            }
            tup.venueOpenHours = res['boxOfficeInfo']['openHoursDetail'];
            tup.venueGeneralRule = res['generalInfo']['generalRule'];
            tup.venueChildRule = res['generalInfo']['childRule'];
            tup.lng = Number(res['location']['longitude']);
            tup.lat = Number(res['location']['latitude']);
            tup.zoom = 10;
            let center = {'latitude': tup.lat, 'longitude': tup.lng};
            tup.center = center;
           } catch (err) {
             console.log(err);
           }

        res.send(JSON.stringify(tup));
      }).catch(err => {
        console.log(err);
        res.status(503).send(err);
      })
})

router.get('/specific-event-details', (req, res) => {
    let url = 'https://app.ticketmaster.com/discovery/v2/events/' + encodeURIComponent(req.query.id) + '?apikey=ZCO9IUNBfaAyVGbG0do4Ok9v2NJHMnQQ';
    let body = getContent(url);
    body.then(function(data) {
        res.header("Content-Type",'application/json');
        // console.log(data);
        let response = [];
        let tup = {};
        try {
        

        let artist_team = '';
        tup.id = req.query.id;
        tup.event_name = data['name'];
        data['_embedded']['attractions'].forEach(element => {
          artist_team +=  element.name + '|';
        });
        artist_team = artist_team.slice(0, -1);
        tup.artist_team = artist_team;
        tup.venue = data['_embedded']['venues'][0]['name'];
        let date = data['dates']['start']['localDate'] + ' ' +
        data['dates']['start']['localTime'];
        
        let dateTime = "";
        let dateString = "";
        if (data['dates']['start']['localDate']){
          tup.dateT = data['dates']['start']['localDate'];
          dateTime += tup.dateT;
          dateString = moment(dateTime, "YYYY-MM-DD").format("MMM DD, YYYY");
        }
        if (data['dates']['start']['localTime']) {
          tup.time = data['dates']['start']['localTime'];
          dateTime += ' ' + tup.time;
          dateString = moment(dateTime, "YYYY-MM-DD HH:mm:ss").format("MMM D, YYYY HH:mm:ss");
        }
        // tup.dateString = dateString;

        tup.date = dateString;
        tup.category = data['classifications'][0]['genre']['name'] + '|' +
        data['classifications'][0]['segment']['name'];
        tup.priceRange = '$' + data['priceRanges'][0]['min'] + ' ~ $' +
        data['priceRanges'][0]['max'];
        tup.ticketStatus = data['dates']['status']['code'];
        tup.buyTicketAt = data['url'];
        tup.seatMap = data['seatmap']['staticUrl'];
        tup.tweetUrl = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(tup.buyTicketAt);
        response.push(tup);
    } catch(err) {
        console.log(err);
    }

        res.send(JSON.stringify(tup));
      }).catch(err => {
        console.log(err);
        res.status(503).send(err);
      })
})

router.get('/autosuggest', (req, res) => {
    let url = 'https://app.ticketmaster.com/discovery/v2/suggest?apikey=ZCO9IUNBfaAyVGbG0do4Ok9v2NJHMnQQ&keyword=' + encodeURIComponent(req.query.keyword);
    let body = getContent(url);
    body.then(function(data) {
        res.header("Content-Type",'application/json');
        // console.log(data);
        let response = [];
        if(data["_embedded"]["attractions"]) {
            let res = data["_embedded"]["attractions"];
            for (var data of res) {
                let tup = {};
                tup.name = data["name"];
                response.push(tup);
            }
        }
        res.send(JSON.stringify(response));
      }).catch(err => {
        console.log(err);
        res.status(503).send(err);
      })
})

router.get('/test-event', (req, res) => {
    // res.send('{"hi":"there"}')
    let lat= Number(req.query.latitude);
    // console.log(lat);
    let lng= Number(req.query.longitude);
    // console.log(req.query.fromLocation);
    if(req.query.fromLocation=="custom_loc") {
        let key = req.query.customLocation;
        let unit = req.query.distance_unit;
        let dist = Number(req.query.distance);
        if(unit=="km") {
            dist = dist * 0.62;
        }
        let locUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(key) + '&key=AIzaSyAmOJZ9uWZmpdms5RC0OCVPhCQuWgLantQ';
        let locBody = getContent(locUrl);
        // console.log(locBody);
        locBody.then(function(data) {
            // console.log(data);
            lat = Number(data['results'][0]['geometry']['location']['lat']);
            lng = Number(data['results'][0]['geometry']['location']['lng']);
            // console.log('latitude is ....');
            // console.log(lat);

            let geoPoint = geohash.encode(lat, lng);
            // console.log('geopoint value is ' + geoPoint);
            //9q5cs
            let url = 'https://app.ticketmaster.com/discovery/v2/events.json?keyword=' + 
            encodeURIComponent(req.query.keyword) + '&geoPoint=' + geoPoint + '&radius='+String(dist)+
            '&segmentId='+req.query.category+'&unit=miles&apikey=ZCO9IUNBfaAyVGbG0do4Ok9v2NJHMnQQ&sort=date,asc';
            // res.send('{' + req.query.distance_ + '}')
            let body = getContent(url);
            body.then(function(data) {
                res.header("Content-Type",'application/json');
                // console.log(data);
            let response = [];
            // console.log(data["_embedded"]["events"][0]["dates"]);
            if (data["_embedded"] && data["_embedded"]["events"].length > 0) {
                let res = data["_embedded"]["events"];
                for (var dat of res) {
                    try {
                        let tup = {};
                        tup.localDate = dat["dates"]["start"]["localDate"];
                        tup.name = dat["name"];
                        if (tup.name.length > 30) {
                          tup.shortName = tup.name.substring(0, 30);
                          tup.shortName = tup.shortName.trim() + "...";
                        } else {
                          tup.shortName = tup.name;
                        }
                        tup.id = dat["id"];
                        tup.genre = dat["classifications"][0]["genre"]["name"] + "-" + dat["classifications"][0]["segment"]["name"];
                        tup.venueInfo = dat["_embedded"]["venues"][0]["name"];
                        response.push(tup);
                      } catch (err) {
                        console.log(err);
                      }
                }
            }
                res.send(JSON.stringify(response));
            }).catch(err => {
                console.log(err);
                res.status(503).send(err);
            })
        })
    } else {
        // console.log(lat);
        let geoPoint = geohash.encode(lat, lng);
        let unit = req.query.distance_unit;
        let dist = Number(req.query.distance);
        if(unit=="km") {
            dist = dist * 0.62;
        }
        // console.log('geopoint value is ' + geoPoint);
        //9q5cs
        let url = 'https://app.ticketmaster.com/discovery/v2/events.json?keyword=' + 
        encodeURIComponent(req.query.keyword) + '&geoPoint=' + geoPoint + '&radius='+String(dist)+
        '&segmentId='+req.query.category+'&unit=miles&apikey=ZCO9IUNBfaAyVGbG0do4Ok9v2NJHMnQQ&sort=date,asc';
        // res.send('{' + req.query.distance_ + '}')
        let body = getContent(url);
        body.then(function(data) {
            res.header("Content-Type",'application/json');
            // console.log(data);

            let response = [];
            // console.log(data["_embedded"]["events"][0]["dates"]);
            if (data["_embedded"] && data["_embedded"]["events"].length > 0) {
                let res = data["_embedded"]["events"];
                for (var dat of res) {
                    try {
                        let tup = {};
                        tup.localDate = dat["dates"]["start"]["localDate"];
                        tup.name = dat["name"];
                        if (tup.name.length > 30) {
                          tup.shortName = tup.name.substring(0, 30);
                          tup.shortName = tup.shortName.trim() + "...";
                        } else {
                          tup.shortName = tup.name;
                        }
                        tup.id = dat["id"];
                        tup.genre = dat["classifications"][0]["genre"]["name"] + "-" + dat["classifications"][0]["segment"]["name"];
                        tup.venueInfo = dat["_embedded"]["venues"][0]["name"];
                        response.push(tup);
                      } catch (err) {
                        console.log(err);
                      }
                }
            }
            res.send(JSON.stringify(response));
        }).catch(err => {
            console.log(err);
            res.status(503).send(err);
        })
    }

})

async function getContent(url) {
    let opt = {
        uri: url,
        json: true
    }
    let response =  await req_hit(opt);
    return response;
    // return await req_hit(opt).then(function(rep){
    //     return rep;
    // });
}

router.post('/event-details', (req, res, next) => {
    // console.log(req);
    let geoPoint = geohash.encode(Number(req['latitude']), Number(req['longitude']));
    let url = 'https://app.ticketmaster.com/discovery/v2/events.json?keyword=' + 
    encodeURIComponent(req['searchKeyword']) + '&geoPoint='+geoPoint+'&radius='+req['distance_']+
    '&segmentId='+req['categoriesList']+'&unit=miles&apikey=ZCO9IUNBfaAyVGbG0do4Ok9v2NJHMnQQ';
    try {
        // const response = await axios.get(url);
        // res.send(JSON.stringify(response.data));
        // res.send(getResponse(url))
    } catch(err) {
        console.log(err);
    }
    // res.send(JSON.stringify('{"hi":"there"}'));
})

router.post('/events', (req, res, next) => {
    // console.log(req);
    let geoPoint = geohash.encode(Number(req['latitude']), Number(req['longitude']));
    let url = 'https://app.ticketmaster.com/discovery/v2/events.json?keyword=' + 
    encodeURIComponent(req['searchKeyword']) + '&geoPoint='+geoPoint+'&radius='+req['distance_']+
    '&segmentId='+req['categoriesList']+'&unit=miles&apikey=ZCO9IUNBfaAyVGbG0do4Ok9v2NJHMnQQ';

    https.get(url, res => {
        res.setEncoding("utf8");
        let body = "";
        res.on("data", data => {
          body += data;
        });
        res.on("end", () => {
          body = JSON.parse(body);
          console.log(body);
        });
      });

})

module.exports = router;