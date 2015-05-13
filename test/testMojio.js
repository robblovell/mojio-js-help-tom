// Generated by CoffeeScript 1.8.0
(function() {
  var config, expect, local_config, mojio;
  expect = require('chai').expect;
  mojio = require('../src/libMojio');
  config = require('../src/config');
  local_config = {
    application: 'fd3ec62d-4e63-4889-9282-0313be66cb69',
    username: 'tofagerl',
    password: 'vCrLYsM**.372kAdwK',
    secret: 'c2f14ec9-bf27-4ccb-8f48-de0774533345',
    hostname: 'api.moj.io',
    version: 'v1',
    port: '443',
    scheme: 'https',
    signalr_port: '80',
    signalr_scheme: 'http',
    live: false
  };
  describe('Mojio Library', function(done) {
    xit("it isn't connected to Mojio yet", function() {
      return mojio.getUser(function(err, res) {
        expect(err).to.be.ok;
        return done();
      });
    });
    it("connect to mojio", function(done) {
      this.timeout(5000);
      return mojio.connect(local_config, function(err, res) {
        local_config.accessToken = res.auth_token;
        expect(res).to.be.ok;
        return done();
      });
    });
    xit('connects to mojio using HTTP', function(done) {
      local_config.username = config.user.username;
      local_config.password = config.user.password;
      return mojio.restLogin(local_config, function(err, result) {
        local_config.access_token = result;
        expect(result.length).to.be.at.least(1);
        return done();
      });
    });
    it('gets user information, thus proving that moj.io is indeed connected', function(done) {
      this.timeout(5000);
      return mojio.getUser(function(err, result) {
        expect(result === null).to.be["false"];
        expect(result.Type === "User").to.be["true"];
        return done();
      });
    });
    return it('Gets all events from previous trip', function(done) {
      this.timeout(30000);
      return mojio.getEntity(config.trips, function(err, result) {
        console.log(result);
        expect(result.Data.length).to.be.at.least(1);
        expect(result.Objects.length).to.be.at.least(1);
        return done();
      });
    });
  });
}).call(this);
//# sourceMappingURL=testMojio.js.map