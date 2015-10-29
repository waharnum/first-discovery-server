/*
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/fluid-project/first-discovery-server/raw/master/LICENSE.txt
*/

"use strict";

var fluid = fluid || require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("gpii-express");

fluid.defaults("gpii.firstDiscovery.server.preferences.handler", {
    gradeNames: ["gpii.express.handler"],
    invokers: {
        handleRequest: {
            funcName: "gpii.firstDiscovery.server.preferences.handler.handleRequest",
            args:     ["{that}"]
        }
    }
});

//TODO: This is just a rough in for the actual handler. This should be updated
// to contact the security layer to request creation of a gpii-token and saving
// of the prefrences set.
gpii.firstDiscovery.server.preferences.handler.handleRequest = function (that) {
    var view = that.request.query.view || "";
    that.sendResponse(200, {token: "mock-gpii-token:" + view});
    // in the case of an error, the appropriate error code should be sent with a
    // response that contains {error: "some error message"}
};

fluid.defaults("gpii.firstDiscovery.server.preferences.router", {
    gradeNames: ["gpii.express.contentAware.router"],
    method: "post",
    handlers: {
        json: {
            contentType:  "application/json",
            handlerGrades: ["gpii.firstDiscovery.server.preferences.handler"]
        }
    }
});
