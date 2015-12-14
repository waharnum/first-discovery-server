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

require("../../src/js/configUtils.js");

jqUnit.test("gpii.resolvers.env", function () {
    var environment = gpii.resolvers.env();
    jqUnit.assertDeepEq("process.env and the component's vars property should be equivalent", process.env, environment.vars);
});

fluid.defaults("gpii.tests.firstDiscovery.schema", {
    gradeNames: ["gpii.schema"],
    schema: {
        "required": ["toValidate"],
        "properties": {
            "toValidate": {
                "type": "string"
            }
        }
    }
});

jqUnit.test("gpii.tests.firstDiscovery.schema - valid", function () {
    jqUnit.expect(1);
    gpii.tests.firstDiscovery.schema({
        toValidate: "valid",
        listeners: {
            "validated": {
                listener: "jqUnit.assert",
                args: ["The schema should have validated and triggered the validated event"]
            }
        }
    });
});

jqUnit.test("gpii.tests.firstDiscovery.schema - invalid", function () {
    jqUnit.expectFrameworkDiagnostic("The schema should have failed validation and thrown an error", gpii.tests.firstDiscovery.schema, "data.toValidate is a required property");
});

fluid.defaults("gpii.tests.firstDiscovery.configurator", {
    gradeNames: ["gpii.configurator"],
    schema: {
        required: ["components"],
        properties: {
            "components": {
                required: ["environment"]
            }
        }
    }
});

jqUnit.test("gpii.configurator", function () {
    jqUnit.expect(1);
    var configurator = gpii.tests.firstDiscovery.configurator();
    jqUnit.assertDeepEq("process.env and the environment subcomponent's vars property should be equivalent", process.env, configurator.environment.vars);
});
