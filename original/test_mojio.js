"use strict";
var expect = require('chai').expect;
var mojio = require('../lib/mojio');
var logger = require('../lib/logger')('demo.test.mojio');
var local_config = {};
var config = require('../config/dev.json').mojio;
describe('Mojio library', function() {
	it('isn\'t connected to Mojio yet', function() {
		mojio.getUser(function(err, result) {
			expect(err).to.be.ok;
		});
	});
	it('connects to mojio', function(done) {
		this.timeout(5000);
		var local_config = config.app;
		local_config.username = config.user.username;
		local_config.password = config.user.password;
		mojio.connect(local_config, function(err, result) {
			expect(result).to.be.ok;
			done();
		});
	});
	it('connects to mojio using HTTP', function(done) {
		local_config.username = config.user.username;
		local_config.password = config.user.password;
		mojio.restLogin(local_config, function(err, result) {
			local_config.access_token = result;
			expect(result.length).to.be.at.least(1);
			done();
		});
	});
	//TODO: implement
	xit('uses token to get a trip', function(done) {
		mojio.restGet(local_config, function(err, result) {
			//TODO: Expect something reasonable.
			expect(result);
		});
	});
	//TODO: Broken upstream
	it('gets user information, thus proving that moj.io is indeed connected', function(done) {
		this.timeout(5000);
		mojio.getUser(function(err, result) {
			expect(result.length).to.be.at.least(1);
			done();
		});
	});
	//TODO: Broken upstream
	it('Gets all events from previous trip', function(done) {
		this.timeout(3000);
		mojio.getEntity(config.trips, function(err, result) {
			expect(result.TotalRows).to.be.at.least(1);
			done();
		});
	});
	xit('creates a new observer, triggers it and unobserves', function(done) {
		this.timeout(5000);
		mojio.testObserver(function(result) {
			if (!result) throw new Error('Nothing changed');
			else if (result) {
				done();
			}
		});
	});
});