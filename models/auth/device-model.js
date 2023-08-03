const { v4: uuidv4 } = require('uuid');

module.exports = class DeviceModul {
    userID;
    deviceID;
    deviceName;
    deviceNameApp;
    deviceIP;

    constructor(module) {
        this.userID = module.userID;
        this.deviceID = uuidv4();
        const userAgent = module.req.headers['user-agent'].split(' ');
        this.deviceName = userAgent.shift();
        this.deviceNameApp = userAgent.join(' ');
        this.deviceIP = module.req.headers['x-forwarded-for'].split(' ')[0];
    }

    convertToArrayForSQL() {
        return [
            this.deviceID,
            this.userID,
            this.deviceName,
            this.deviceNameApp,
            this.deviceIP,
        ];
    }
};
