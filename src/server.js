// require the http module of node.js
var http = require('http');
// require the dispatcher module
var HttpDispatcher = require('httpdispatcher');
var dispatcher = new HttpDispatcher();
// require contract logic
var contract = require('./contract-endpoints');
var security = require('./security');

// define the port of access for your server
const PORT = 8080;

// We need a function which handles requests and send response
function handleRequest(request, response){
    try {
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log(err);
    }
}

// Create a server
var myFirstServer = http.createServer(handleRequest);

// add some routes

//A sample GET request
dispatcher.onGet("/", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<h1>Hey, this is the homepage of your server.</h1>');
});

dispatcher.onGet("/users", async function(req, res) {
    if (!req.params.user) {
        throw new Error('UserID expected');
    }

    let result = null;
    try {
        const user = req.params.user;
        result = await contract.getIdentifierByUser({ user });
    } catch (err) {
        result = err;
    }

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(result + '');
});

dispatcher.onGet("/set_user", async function(req, res) {
    if (!req.params.user || !req.params.identifier) {
        throw new Error('Params: [user, identifier] expected');
    }

    let result = null;
    try {
        const user = req.params.user;
        const identifier = req.params.identifier;
        result = await contract.setIdentifierForUser({
            identifier: security.encryptWithPublic({ msg: identifier }),
            user,
        });
    } catch (err) {
        result = err;
    }

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(result + '');
});

dispatcher.onGet("/get_public_key", async function (req, res) {
    let result = await security.encryptWithPublic({ msg: 'foo' });

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(security.getPublicKey() + '');
});

dispatcher.onGet("/verify_private", async function(req, res) {
    if (!req.params.encrypted || !req.params.user) {
        throw new Error('Params: [encrypted, user] expected');
    }

    try {
        const user = req.params.user;

        let decryptedPayload = await security.decryptWithPrivate({ encrypted: req.params.encrypted });
        const storage = await contract.getIdentifierByUser({ user });
        const decryptedComparison = await security.decryptWithPrivate({ encrypted: storage });

        const isVerified = decryptedPayload === decryptedComparison;

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(isVerified));
    } catch (err) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(err + '');

        return;
    }
});

dispatcher.onError(function(req, res) {
    res.writeHead(404);
    res.end("Error, the URL doesn't exist");
});

// Start the server !
myFirstServer.listen(PORT, function(){
    // Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
