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
var jqUnit       = require("jqUnit");
fluid.registerNamespace("gpii.tests.firstDiscovery.server");

require("../../src/js/firstDiscoveryServer.js");
require("../../node_modules/gpii-express/tests/js/lib/test-helpers.js");
require("../../node_modules/kettle");
require("../../node_modules/kettle/lib/test/KettleTestUtils");

fluid.defaults("gpii.tests.firstDiscovery.server.request", {
    gradeNames: ["kettle.test.request.http"],
    path:       "http://localhost/user",
    // path:       "{testEnvironment}.options.baseUrl",
    port:       "{testEnvironment}.options.port"
});

gpii.tests.firstDiscovery.server.verifyJSONResponse = function (response, body, expectedResponse, expectedBody) {
    gpii.express.tests.helpers.isSaneResponse(jqUnit, response, body, 200);
    jqUnit.assertDeepEq("The body should be as expected...", expectedBody, JSON.parse(body));
};

fluid.defaults("gpii.tests.firstDiscovery.server", {
    gradeNames: ["gpii.firstDiscovery.server"],
    config: {
        express: {
            port: "{testEnvironment}.options.port",
            baseUrl: "{testEnvironment}.options.baseUrl"
        }
    },
    events: {
        onStarted: "{testEnvironment}.events.onStarted"
    }
});

fluid.defaults("gpii.tests.firstDiscovery.server.requestTests", {
    gradeNames: ["fluid.test.testEnvironment"],
    events: {
        constructServer: null,
        onStarted: null
    },
    port: 8081,
    baseUrl: "http://localhost/",
    components: {
        express: {
            createOnEvent: "constructServer",
            type: "gpii.tests.firstDiscovery.server"
        },
        testCaseHolder: {
            type: "gpii.express.tests.caseHolder",
            options: {
                expected: {
                    response: 200,
                    body: {token: "mock-gpii-token"}
                },
                rawModules: [{
                    tests: [{
                        name: "Test ",
                        type: "test",
                        sequence: [{
                            func: "{jsonRequest}.send"
                        }, {
                            listener: "gpii.tests.firstDiscovery.server.verifyJSONResponse",
                            event:    "{jsonRequest}.events.onComplete",
                            args:     ["{jsonRequest}.nativeResponse", "{arguments}.0", "{testCaseHolder}.options.expected.response", "{testCaseHolder}.options.expected.body"]
                        }]
                    }]
                }],
                components: {
                    jsonRequest: {
                        type: "gpii.tests.firstDiscovery.server.request",
                        options: {
                            method: "POST",
                            headers: {
                                accept: "application/json"
                            }
                        }
                    }
                }
            }
        }
    }
});

fluid.test.runTests([
    "gpii.tests.firstDiscovery.server.requestTests"
]);
