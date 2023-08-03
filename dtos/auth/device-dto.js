module.exports = class DeviceDto {
    deviceID;
    userAgent;
    deviceName;
    deviceNameApp;
    deviceIP;

    constructor(module) {
        this.deviceID = module.deviceID;
        this.userAgent = module.req.headers['user-agent'].split(' ');
        this.deviceName = this.userAgent.shift();
        this.deviceNameApp = this.userAgent.join(' ');
        this.deviceIP = module.req.headers['x-forwarded-for'].split(' ')[0];
    }

    getArrayFormat(userID) {
        return [
            this.deviceID,
            userID,
            this.deviceName,
            this.deviceNameApp,
            this.deviceIP,
        ];
    }
};
