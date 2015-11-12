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
require("./src/js/firstDiscoveryServer.js");

// TODO: Add security server configuration
// The idea will be to use environment variables
// to represent all values in the configuration. Additionally
// an implementor will be able provide a JSON config file which will be
// sourced from the root directory of the FD Server. These two sources
// will be merged together, with the environment variables taking precedence.
// An additional requirement will be that the resulting object will need
// to be validated to ensure that all of the properties are provided, because
// they are all required. If any are missing, the applicaiton should error out.
gpii.firstDiscovery.server({
    port: process.env.FIRST_DISCOVERY_SERVER_TCP_PORT
});
