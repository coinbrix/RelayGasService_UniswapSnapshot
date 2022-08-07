const bodyParser = require("body-parser");
var express = require('express'),
  app = express(),
  port = 8080;

var cors = require('cors')
var generateSignatureRouter = require('./relay/relaytxn')

app.use(cors({ origin: '*'}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/relay',generateSignatureRouter);


const server = app.listen(port,host='0.0.0.0');
server.timeout = 600000;
console.log("server started")
