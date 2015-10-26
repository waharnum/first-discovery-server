/*
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/fluid-project/first-discovery-server/raw/master/LICENSE.txt
*/

"use strict";

var fluid = fluid || require("infusion");

require("gpii-express");
require("./preferencesRouter.js");

var path = require("path");
var fdDemosDir = path.resolve(__dirname, "../../node_modules/first-discovery/demos");
var fdSrcDir = path.resolve(__dirname, "../../node_modules/first-discovery/src");

fluid.defaults("gpii.firstDiscovery.server", {
    gradeNames: ["gpii.express"],
    port: 8080,
    config: {
        express: {
            baseUrl: {
                expander: {
                    funcName: "fluid.stringTemplate",
                    args: ["http://localhost:%port", {port: "{that}.options.config.express.port"}]
                }
            }
        }
    },
    components: {
        demoRouter: {
            type: "gpii.express.router.static",
            options: {
                path:    "/demos",
                content: fdDemosDir
            }
        },
        srcRouter: {
            type: "gpii.express.router.static",
            options: {
                path:    "/src",
                content: fdSrcDir
            }
        },
        prefsRouter: {
            type: "gpii.firstDiscovery.server.preferences.router",
            options: {
                path: "/user"
            }
        }
    },
    distributeOptions: [{
        source: "{that}.options.port",
        target: "{that}.options.config.express.port"
    }]
});
