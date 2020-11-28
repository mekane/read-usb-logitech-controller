const usb = require('usb');

const {findLogitechController} = require('./src/device.js');

main();

async function main() {
    const devices = usb.getDeviceList();
    const controller = await findLogitechController(devices);

    if (!controller) {
        console.log('Logitech controller not found!');
        process.exit(0);
    }

    openInterface(controller.interfaces[0]);
}


const logitechInEndpointAddress = 129;
const closeEndpoints = true;

function openInterface(usbInterface) {
    usbInterface.claim();
    //console.log(`Claimed Interface. Driver Active: ${usbInterface.isKernelDriverActive()}`);

    const endpoint = usbInterface.endpoint(logitechInEndpointAddress);

    endpoint.on('data', dataBuf => {
        console.log(dataBuf);
    })
    endpoint.startPoll();

    /*
    //TODO: call when done
    endpoint.stopPoll();
    usbInterface.release(closeEndpoints, err => {
        if (err)
            console.log(err)
    });
     */
}