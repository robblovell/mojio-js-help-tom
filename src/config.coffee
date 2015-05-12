module.exports =
    user:
        username: ""
        password: ""

    app:
        application: ""
        secret: ""
        redirect: "http://46.226.14.158:3000/mojio"
        hostname: "api.moj.io"
        version: "v1"
        port: "443"
        scheme: "https"
        live: false

    trips:
        Subject: "Trip"
        Parent: "Vehicle"
        ParentID: "6c68c5a7-1675-42b7-a445-44c2cae3bdd9"

    test:
        Subject: "Trip"
        _id: "24ba9553-54e0-4c70-a2ca-c953f05fcb4a"

    events:
        Subject: "Event"
        Parent: "Trip"
        ParentID: "24ba9553-54e0-4c70-a2ca-c953f05fcb4a"

    signalr:
        hostname: "api.moj.io"
        port: "443"
        signalr_scheme: "http"
        signalr_port: "80"
        signalr_hub: "ObserverHub"
        live: false

