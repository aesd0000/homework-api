var uuid = require('node-uuid');
var JSONStream = require('JSONStream');
var express = require('express');
var _login = express.Router();
var base64 = require('base64-stream');


_login.post('*', function (req, res) {
  

  var opt = { limit: 1 };
  var value = req.headers.username;
  var collection = req.collection;

  let form ={
    username:value
  }


  collection.findOne(form, opt, function (err, doc) {

    if (!err) {
      if (!doc) {
        res.json({
          'ok': false,
          'message': 'Not Found'
        });
      } else {
        let result={
          'ok':true,
          password:doc.password
        }
        res.json(result);
      }
    } else {
      res.json({
        'ok': false,
        'message': err
      });
    }
  })
});


module.exports = _login;