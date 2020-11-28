const logitechInfo = 'Logitech Logitech Dual Action';

async function findLogitechController(devices) {
    let controller = null;

    for (const dev of devices) {
        const deviceInfo = await getDeviceInfo(dev);
        if (deviceInfo === logitechInfo)
            controller = dev;
    }

    return controller;
}

async function getDeviceInfo(device) {
    try {
        const manufacturer = await getDeviceProperty(device, 'iManufacturer');
        const product = await getDeviceProperty(device, 'iProduct');
        return `${manufacturer} ${product}`;
    } catch (e) {
        return null;
    }
}

async function getDeviceProperty(device, property) {
    return new Promise((resolve, reject) => {
        try {
            device.open();
            device.getStringDescriptor(device.deviceDescriptor[property], (err, result) => {
                if (err) {
                    console.log('Reject with error in callback')
                    reject(err);
                    device.close();
                } else {
                    resolve(result);
                }
            });
        } catch (err) {
            reject(err);
            device.close();
        }
    });
}

module.exports = {
    findLogitechController
}