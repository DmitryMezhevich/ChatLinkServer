const { v4: uuidv4 } = require('uuid');

module.exports = class DeviceModel {
    deviceID;
    userID;
    deviceName;
    deviceNameApp;
    deviceIP;
    createdAt;

    constructor(module) {
        if (module) {
            this.deviceID = module.device_id;
            this.userID = module.user_id || module.userID;
            this.deviceName = module.device_name;
            this.deviceNameApp = module.device_name_app;
            this.deviceIP = module.device_ip;
            this.createdAt = module.device_created_at;
        }
    }

    createNewDevice(headers) {
        this.deviceID = uuidv4();
        const userAgent = headers.userAgent.split(' ');
        this.deviceName = userAgent.shift();
        this.deviceNameApp = userAgent.join(' ');
        this.deviceIP = headers.xForwardedFor.split(' ')[0];
        return this;
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
