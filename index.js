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

    const interface0 = controller.interfaces[0];
    console.log('INTERFACE');
    console.log(interface0);
}
