"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("expo/config-plugins");
const withOutbrainAndroid_1 = require("./withOutbrainAndroid");
const withOutbrainIos_1 = require("./withOutbrainIos");
const pkg = require('../../package.json');
const withOutbrain = (config, props = {}) => {
    const pluginProps = props || {};
    // Android: Maven repo + optional GMA conflict fix
    config = (0, withOutbrainAndroid_1.withOutbrainMaven)(config, pluginProps);
    config = (0, withOutbrainAndroid_1.withOutbrainGmaFix)(config, pluginProps);
    // iOS: optional in-app browser pod
    config = (0, withOutbrainIos_1.withOutbrainIos)(config, pluginProps);
    return config;
};
exports.default = (0, config_plugins_1.createRunOncePlugin)(withOutbrain, pkg.name, pkg.version);
//# sourceMappingURL=index.js.map