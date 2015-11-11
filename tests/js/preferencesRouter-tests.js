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
var jqUnit = require("node-jqunit");
var kettle = require("kettle");
var nock = require("nock");
var querystring = require("querystring");

kettle.loadTestingSupport();

require("../../src/js/firstDiscoveryServer.js");
require("gpii-express/tests/js/lib/test-helpers.js");

fluid.registerNamespace("gpii.tests.firstDiscovery.server");

fluid.defaults("gpii.tests.firstDiscovery.server.request", {
    gradeNames: ["kettle.test.request.http"],
    path:       "http://localhost/user?view=firstDiscovery",
    port:       "{testEnvironment}.options.port"
});

gpii.tests.firstDiscovery.server.verifyJSONResponse = function (response, body, expectedResponse, expectedBody) {
    gpii.express.tests.helpers.isSaneResponse(jqUnit, response, body, 200);
    jqUnit.assertDeepEq("The body should be as expected...", expectedBody, JSON.parse(body));
};

fluid.defaults("gpii.tests.firstDiscovery.server", {
    gradeNames: ["gpii.firstDiscovery.server"],
    port: "{testEnvironment}.options.port",
    events: {
        onStarted: "{testEnvironment}.events.onStarted"
    }
});


// TODO: Launch an instance of the security server to use for testing.
// This will likely require pulling in gpii unversal and launching a
// security server with the appropirate configuration needed for testing.
// Currenlty this is not possible due to gpii universal and the first
// discovery server depend on incompatible versions of infusion.
// see: https://issues.gpii.net/browse/GPII-1318
// For the time being, nock is used to intercept the http requests, providing
// a simple mock solution for testing the requests to the security server.
fluid.defaults("gpii.tests.firstDiscovery.server.requestTests", {
    gradeNames: ["fluid.test.testEnvironment"],
    events: {
        constructServer: null,
        onStarted: null
    },
    port: 8111,
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
                    body: {
                        "userToken": "2288e676-d0bb-4d29-8131-7cff268ba012",
                        "preferences": {
                            "contexts": {
                                "gpii-default": {
                                    "name": "Default preferences",
                                    "preferences": {
                                        "gpii_firstDiscovery_language": "en-US"
                                    }
                                }
                            }
                        }
                    }
                },
                rawModules: [{
                    tests: [{
                        name: "Test ",
                        type: "test",
                        sequence: [{
                            funcName: "gpii.tests.firstDiscovery.server.requestTests.setupNock"
                        }, {
                            func: "{jsonRequest}.send",
                            args: [{
                                "gpii_firstDiscovery_language": "en-US"
                            }]
                        }, {
                            listener: "gpii.tests.firstDiscovery.server.verifyJSONResponse",
                            event:    "{jsonRequest}.events.onComplete",
                            args:     ["{jsonRequest}.nativeResponse", "{arguments}.0", "{testCaseHolder}.options.expected.response", "{testCaseHolder}.options.expected.body"]
                        }, {
                            funcName: "gpii.tests.firstDiscovery.server.requestTests.teardownNock"
                        }]
                    }]
                }],
                components: {
                    jsonRequest: {
                        type: "gpii.tests.firstDiscovery.server.request",
                        options: {
                            method: "POST"
                        }
                    }
                }
            }
        }
    }
});

gpii.tests.firstDiscovery.server.requestTests.setupNock = function () {
    var accessTokenModel = {
        grant_type: "client_credentials",
        scope: "add_preferences",
        client_id: "client_first_discovery",
        client_secret: "client_secret_firstDiscovery"
    };

    var prefs = {
        "contexts": {
            "gpii-default": {
                "name": "Default preferences",
                "preferences": {
                    "gpii_firstDiscovery_language": "en-US"
                }
            }
        }
    };

    var security = nock("http://10.0.2.2:8081").log(console.log);
    security.post("/access_token", querystring.stringify(accessTokenModel))
            .reply(200, {
                access_token: "first_discovery_access_token",
                token_type: "Bearer"
            });

        security.post("/add-preferences", prefs, {
        reqHeaders: {
            Authorization: "Bearer first_discovery_access_token"
        }
    })
    .query({view: "firstDiscovery"})
    .reply(200, {
        "userToken": "2288e676-d0bb-4d29-8131-7cff268ba012",
        "preferences": {
            "contexts": {
                "gpii-default": {
                    "name": "Default preferences",
                    "preferences": {
                        "gpii_firstDiscovery_language": "en-US"
                    }
                }
            }
        }
    });
};

gpii.tests.firstDiscovery.server.requestTests.teardownNock = function () {
    nock.isDone();
    nock.cleanAll();
    nock.restore();
};

fluid.test.runTests([
    "gpii.tests.firstDiscovery.server.requestTests"
]);
