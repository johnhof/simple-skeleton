var superTest = require('supertest');
var server    = require('../server');
var mocha     = require('mocha');
var expect    = require('chai').expect;
var _         = require('lodash');
var mon       = require('mongoman');


//////////////////////////////////////////////////////////////////////////////////
//
// Test setup
//
//////////////////////////////////////////////////////////////////////////////////

mon.connect();

// register models
mon.registerAll(__dirname + '/../api/components', /_model$/i);

// store the server instance
var port = Math.floor(Math.random() * (999)) + 7000;
var api  = superTest(server(port, true));

// helper to parse a json body
function parse (body) {
  var json = {};

  try {
    json = JSON.parse(body);
  } catch (e) {}

  return json;
}


//////////////////////////////////////////////////////////////////////////////////
//
// Tests
//
//////////////////////////////////////////////////////////////////////////////////


describe('API Endpoints', function () {

  // Clear the databse before every test
  beforeEach(function (done){
    mon.drop('db');
    done();
  });

  describe('/users', function () {

  });
});