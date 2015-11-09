/*
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/fluid-project/first-discovery-server/raw/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");
var kettle = require("kettle");

fluid.defaults("gpii.firstDiscovery.server.dataSource.security", {
    gradeNames: ["kettle.dataSource.URL"],
    writable: true,
    components: {
        encoding: {
            type: "kettle.dataSource.encoding.formenc"
        }
    },
    setResponseTransforms: [] // Do not parse the "set" response as formenc - it is in fact JSON
});
