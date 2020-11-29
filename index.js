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

    endpoint.on('data', dataReceived);
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

function dataReceived(byteBuffer) {
    console.log(byteBuffer);
    const bytes = Array.prototype.slice.call(new Uint8Array(byteBuffer, 0, 8));
    update(bytes);
}

const button_1_mask = 0x10;
const button_2_mask = 0x20;
const button_3_mask = 0x40;
const button_4_mask = 0x80;

const button_5_mask = 0x01;
const button_6_mask = 0x02;
const button_7_mask = 0x04;
const button_8_mask = 0x08;

const button_9_mask = 0x10;
const button_10_mask = 0x20;

const dpad_mask = 0x0f;

const dPadDir = ['Up', 'Up-Right', 'Right', 'Down-Right', 'Down', 'Down-Left', 'Left', 'Up-Left', '-'];

function update(byte) {
    const leftH = byte[0] - 128;
    const leftV = byte[1] - 128;
    const rightH = byte[2] - 128;
    const rightV = byte[3] - 128;

    const button1 = byte[4];
    const button2 = byte[5];

    const dPadValue = button1 & dpad_mask;
    const dPad = dPadDir[dPadValue];

    const mode = byte[6];

    const state = {
        leftH,
        leftV,
        rightH,
        rightV,
        dPad,
        button1: !!(button1 & button_1_mask),
        button2: !!(button1 & button_2_mask),
        button3: !!(button1 & button_3_mask),
        button4: !!(button1 & button_4_mask),
        button5: !!(button2 & button_5_mask),
        button6: !!(button2 & button_6_mask),
        button7: !!(button2 & button_7_mask),
        button8: !!(button2 & button_8_mask),
        button9: !!(button2 & button_9_mask),
        button10: !!(button2 & button_10_mask)
    }

    console.log(state);
}
