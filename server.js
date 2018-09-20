var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var MongoClient = require('mongodb').MongoClient;
var ip = require("ip");

var route = require('./route');
var config = require('./config');
var login = require('./login');


var mongodb = {};

var app = express();

app.use(cors());
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('*', function (req, res, next) {
  res.set({
    'Access-Control-Expose-Headers': 'Authorization',
    'Content-Type': 'application/json; charset=utf-8',
    'Bind-Address': ip.address() + ':' + config.port
  });
  next();
});

app.param('db', function (req, res, next, value) {
  req.mongodb = mongodb[value];
  next();
});

app.param('collection', function (req, res, next, value) {
   req.collection = req.mongodb.collection(value);
  next();
});

 app.post('/login',function(req, res, next){
  req.url = '/_login/cores/user_db';
  next();
})

 app.use('/_login/:db/:collection',login)



app.use('/mongodb/:db/:collection',route);

app.get('/servertime', function (req, res) {
  var long_date = new Date().getTime()
  res.send(long_date.toString());
});


const url = 'mongodb://localhost:27017';
var count = config.mongodb.length;

config.mongodb.forEach(function (db_config) {
  MongoClient.connect(url, function (err, client) {
    if (!err) {
      count--
      console.log("Connected successfully to server");
      mongodb[db_config.db] = client.db(db_config.db);

      if (count == 0) {
        app.listen(config.port, function () {
          console.log('Server listening on port %d', this.address().port);
        })
      }


    }
  })

})
