const {subscribeToControllerEvents, cancel} = require('./src/logitechController');

function controllerEvent(newState) {
    console.log(newState);
}

subscribeToControllerEvents(controllerEvent)
    .catch(err => {
        console.error(err)
        cancel();
    });
