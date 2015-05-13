MojioClient = require 'mojio-js'
config = require './config'
rest = require 'restler'

scope = process.env.NODE_ENV || 'dev'
logger = console
mojioClient = null
connection = null

module.exports =
    connect: (local_config, callback) ->
        if (!local_config.username || !local_config.password)
            return callback(new Error('Not connected'))
        else
            mojioClient = new MojioClient(local_config);
            mojioClient.login(local_config.username, local_config.password, (err, result) ->
                if (err)
                    logger.error(err)
                    return callback(err)
                else
                    return callback(null, mojioClient)
            )
    isConnected: () ->
        if (mojioClient)
            return true
        else
            return false

    getUser: (callback) ->
        if (!mojioClient)
            err = new Error("We are not connected to Mojio.")
            return callback(err)

        mojioClient.getCurrentUser((err, result) ->
            if (err)
                callback(err)
            else
                callback(null, result)
        )
    restLogin: (input_config, callback) ->
        request =
            method: 'post'
            data:
                username: input_config.username
                password: input_config.password
                client_id: config.app.application
                client_secret: config.app.secret
                grant_type: 'password'

        rest.post('https://api.moj.io/OAuth2Sandbox/token', request).on('complete', (result, response) ->
            if (response.statusCode == 200)
                token = JSON.parse(response.rawEncoded).access_token
                return callback(null, token)
            else
                logger.error('User ' + request.username + ' NOT logged in! Response:\n' + util.inspect(response, false, null))
                return callback(new Error('Login Error!'), '')

        )

    getEntity: (local_config, callback) ->
        if (!@isConnected())
            err = new Error("We are not connected to Mojio.")
            return callback(err)

        model = mojioClient.model(local_config.subject)
        mojioClient.get(model, local_config.criteria, (err, result) ->
            if (err)
                callback(err)
            else
                mojioClient.getResults(model, result)
                callback(null, result)
        )


    testObserver: (callback) ->
        App = mojioClient.model('App');
        mojioClient.get(App, {}, (error, result) ->
            event_triggered = false

            app = new App(result[0])
            logger.info("retrieved app");
            return mojioClient.observe(app, null,
                (entity) ->
                    event_triggered = true;
                    return mojioClient.unobserve(observer, app, null, ((error, result) -> {}))
                ,
                (error, result) ->
                    app.Description = "Changed";
                    observer = result;
                    mojioClient.put(app, (error, result) ->
                        event_triggered = true;
                        return callback(event_triggered);
                    )
                    app.Description = "A Description"
                    return mojioClient.put(app, (error, result) ->
                        logger.info("App changed back.")
                    )
            )
        )
