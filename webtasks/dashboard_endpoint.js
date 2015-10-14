//wt create dashboard_endpoint.js --no-merge --no-parse

var Express = require('express');
var Webtask = require('webtask-tools');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient

var url = 'mongodb://webtasks:123456@ds051873.mongolab.com:51873/dashboard';

var app = Express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// GET
app.all('/', 
  function(req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
  },
  function(req, res, next) {

    if (req.method.toLowerCase() === 'options') {
      req.end();
    } else {
      next();
    }
  },
  function(req, res, next) {

    var filter = req.query.filter || req.body.filter || [];

    if (filter.length > 0) {

      var conditions = [];

      conditions = filter.map(function(f) {
        var condition = {};
        condition[f.field] = { '$in': f.value };
        return condition;
      });

      req.filter = {'$and': conditions };

    } else {

      req.filter = {};

    }

    next();
  },
  function (req, res) {
    if (global.db) {
      answerRequest(global.db, req, res);
    } else {

      MongoClient.connect(url, function(err, db) {
        global.db = db;
        if (err) {
          res.json(err).end();
        } else {
          answerRequest(db, req, res);
        }
      });

    }
  });


function answerRequest(db, req, res) {

  db.collection('users').find(req.filter).toArray(function(err, docs) {

      res.json(docs).end();
  
  });

}

module.exports = Webtask.fromExpress(app);