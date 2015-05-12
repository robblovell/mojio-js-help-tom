"use strict";
var MojioClient = require('mojio-js'),
	async = require('async'),
	util = require('util'),
	rest = require('restler'),
	mojioClient,
	scope = process.env.NODE_ENV || 'dev',
	connection,
	config = require('../config/' + scope + '.json').mojio,
	logger = require('./logger')('demo.lib.signalr');
/**
 * Connects and authenticates against api.moj.io
 * @param  {Object}   local_config Configuration object to use when connecting and authenticating. Optional.
 * @param  {callback} callback     The callback
 * TODO: Implement constructor
 */
function connect(local_config, callback) {
		if (!local_config.username || !local_config.password) {
			return callback(new Error('Not connected'));
		} else {
			mojioClient = new MojioClient(local_config);
			mojioClient.login(local_config.username, local_config.password, function(err, result) {
				if (err) {
					logger.error(err);
					return callback(err);
				} else {
					return callback(null, mojioClient);
				}
			});
		}
	}
	/**
	 * check if connection exists to Moj.io
	 * @return {Boolean} Connection status.
	 * @TODO: implement further check
	 */
function isConnected() {
		if (mojioClient) return true;
		else return false;
	}
	/**
	 * get information about current user logged in to moj.io
	 * @param  {callback} callback The callback
	 * @return {Object}            Current user
	 */
function getUser(callback) {
		if (!mojioClient) {
			var err = new Error("We are not connected to Mojio.");
			return callback(err);
		}
		mojioClient.getCurrentUser(function(err, result) {
			if (err) callback(err);
			else callback(null, result);
		});
	}
	/**
	 * Retrieves all data connected to the specified entity
	 * @param  {Object}   local_config The specification for the request
	 * @param  {callback} callback     The callback
	 * @return {Object}                All data connected to the specified entity
	 */
function getEntity(local_config, callback) {
	if (!isConnected) {
		var err = new Error("We are not connected to Mojio.");
		return callback(err);
	}
	var model = mojioClient.model(local_config.Subject);
	mojioClient.get(model, local_config, function(err, result) {
		if (err) callback(err);
		else {
			mojioClient.getResults(model, result);
			callback(null, result);
		}
	});
}

function restLogin(input_config, callback) {
	var request = {
		method: 'post',
		data: {
			username: input_config.username,
			password: input_config.password,
			client_id: config.app.application,
			client_secret: config.app.secret,
			grant_type: 'password'
		}
	};
	rest.post('https://api.moj.io/OAuth2Sandbox/token', request).on('complete', function(result, response) {
		if (response.statusCode == 200) {
			var token = JSON.parse(response.rawEncoded).access_token;
			return callback(null, token);
		} else {
			logger.error('User ' + request.username + ' NOT logged in! Response:\n' + util.inspect(response, false, null));
			return callback(new Error('Login Error!'), '');
		}
	});
}

function getEntityThroughHTTP(local_config, callback) {}

function testObserver(callback) {
		var App = mojioClient.model('App');
		mojioClient.get(App, {}, function(error, result) {
			var event_triggered = false;
			var app;
			var observer;
			app = new App(result[0]);
			logger.info("retrieved app");
			return mojioClient.observe(app, null, function(entity) {
				event_triggered = true;
				return mojioClient.unobserve(observer, app, null, function(error, result) {});
			}, function(error, result) {
				app.Description = "Changed";
				observer = result;
				mojioClient.put(app, function(error, result) {
					event_triggered = true;
					return callback(event_triggered);
				});
				app.Description = "A Description";
				return mojioClient.put(app, function(error, result) {
					logger.info("App changed back.");
				});
			});
		});
	}
	/**
	 * Create an observer which will watch for changes and react to then
	 * @param  {Object}   local_config Configuration object to use when creating observer
	 * @param  {callback} callback     Callback function
	 * @return {Object}                Either error, or TODO: Find out what this is.
	 */
function createObserver(local_config, eventCb, callback) {
	if (!isConnected) {
		var err = new Error("We are not connected to Mojio.");
		return callback(err);
	}
	mojioClient.watch(local_config.entity, function(entity) {
		eventCb(null, entity);
	}, function(err, result) {
		if (err) return callback(err);
		else return callback(result);
	});
}
exports.connect = connect;
exports.getEntity = getEntity;
exports.createObserver = createObserver;
exports.getUser = getUser;
exports.testObserver = testObserver;
exports.restLogin = restLogin;
/**
 * @callback callback
 * @param {Error} err
 * @param {Object} result
 */