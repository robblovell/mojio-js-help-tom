expect = require('chai').expect
mojio = require '../src/libMojio'
config = require '../src/config'

local_config = {
    application: '6457d3dc-32f1-4f47-b030-211bc5544533',
    secret: '35bf63e7-4443-4883-8d46-1e9195dec800',
    hostname: 'api.moj.io',
    version: 'v1',
    port:'443',
    scheme:'https',
    signalr_port:'80',
    signalr_scheme:'http'
    live: false
}


describe 'Mojio Library', ->
    it "it isn't connected to Mojio yet", ->
        mojio.getUser((err, res) ->
            expect(err).to.be.ok
        )

    it "connect to mojio", (done) ->
        @timeout(5000)
        local_config.username = "anonymous@moj.io"
        local_config.password = "Password007"
        mojio.connect(local_config, (err, res) ->
            expect(res).to.be.ok
            done()
        )

    it 'connects to mojio using HTTP', (done) ->
        local_config.username = config.user.username
        local_config.password = config.user.password
        mojio.restLogin(local_config, (err, result) ->
            local_config.access_token = result
            expect(result.length).to.be.at.least(1)
            done()
        )

    it 'gets user information, thus proving that moj.io is indeed connected', (done) ->
        this.timeout(5000)
        mojio.getUser((err, result) ->
            expect(result==null).to.be.false
            expect(result.Type=="User").to.be.true
            done()
        )

    it 'Gets all events from previous trip', (done) ->
        this.timeout(300000)
        mojio.getEntity(config.trip, (err, result) ->
            expect(result.Data.length).to.be.at.least(1)
            expect(result.Objects.length).to.be.at.least(1)
            done()
        )
