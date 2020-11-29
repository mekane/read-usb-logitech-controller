const WebSocket = require('ws');
const {subscribeToControllerEvents, cancel} = require('../src/logitechController');

// SETUP WEBSOCKET SERVER
const wss = new WebSocket.Server({port: 8080});

const clients = [];

wss.on('connection', function connection(socket) {
    clients.push(socket);

    socket.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    socket.send('{ "message": "initial server message" }');
});


// SUBSCRIBE TO USB CONTROLLER EVENTS AND PUBLISH TO WEB SOCKETS
function controllerEvent(newState) {
    clients.forEach(socket => socket.send(JSON.stringify(newState)));
}

subscribeToControllerEvents(controllerEvent)
    .catch(err => {
        console.error(err)
        cancel();
    });
