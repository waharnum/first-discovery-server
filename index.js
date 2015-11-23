/*
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/GPII/first-discovery-server/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");
var path = require("path");
require("./src/js/firstDiscoveryServer.js");
require("./src/js/config.js");

var configFile = path.join(__dirname, "./fd_security_config.json");
var ENVMap = gpii.firstDiscovery.server.config.oauth2.clientCredential.ENVMap;
var schema = gpii.firstDiscovery.server.config.oauth2.clientCredential.schema;
var oauth2Config = gpii.firstDiscovery.server.config.getConfig(configFile, ENVMap, schema);

gpii.firstDiscovery.server({
    port: process.env.FIRST_DISCOVERY_SERVER_TCP_PORT,
    preferencesConfig: oauth2Config
});
