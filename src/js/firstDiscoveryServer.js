/*
Copyright 2015 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

var fluid = fluid || require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("gpii-express");

var path = require("path");
var fdDemosDir = path.resolve(__dirname, "../../node_modules/first-discovery/demos");
var fdSrcDir = path.resolve(__dirname, "../../node_modules/first-discovery/src");

fluid.defaults("gpii.firstDiscovery.server", {
    gradeNames: ["gpii.express"],
    config: {
        express: {
            port: 8080,
            baseUrl: "http://localhost:8080"
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
        }
    }
});

gpii.firstDiscovery.server();
