const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

module.exports = function (app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/static', express.static('public'));
  // app.use(function (req, res, next) {
  //   res.header("Access-Control-Allow-Origin", '*');
  //   res.header("Access-Control-Allow-Credentials", true);
  //   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  //   res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  //   next();
  // });
};