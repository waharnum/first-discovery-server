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
var expectedConfig = require("../configs/testConfig.json");

var path = require("path");
var testConfigPath = path.join(__dirname, "../configs/testConfig.json");
var missingConfigPath = path.join(__dirname, "../configs/misssingConfig.json");

require("../../src/js/config.js");

fluid.defaults("gpii.tests.env", {
    gradeNames: ["fluid.component"],
    members: {
        toRemove: []
    },
    invokers: {
        set: {
            funcName: "gpii.tests.env.set",
            args: ["{that}", "{arguments}.0"]
        },
        remove: {
            funcName: "gpii.tests.env.remove",
            args: ["{that}.toRemove"]
        }
    }
});

gpii.tests.env.set = function (that, variables) {
    var changes = [];

    fluid.each(variables, function (value, key) {
        changes.push(key);
        process.env[key] = value;
    });

    that.toRemove = that.toRemove.concat(changes);
};

gpii.tests.env.remove = function (toRemove) {
    fluid.each(toRemove, function (variable) {
        delete process.env[variable];
    });
    toRemove = [];
};

jqUnit.test("gpii.firstDiscovery.server.config.getConfigFile", function () {
    var configExists = gpii.firstDiscovery.server.config.getConfigFile(testConfigPath);
    jqUnit.assertDeepEq("The config should have been loaded from the file", expectedConfig, configExists);

    var configMissing = gpii.firstDiscovery.server.config.getConfigFile(missingConfigPath);
    jqUnit.assertDeepEq("The config should default to an empty object", {}, configMissing);
});

gpii.tests.envToSet = {
    "GPII_OAUTH2_TCP_PORT": "8888",
    "GPII_OAUTH2_HOST_NAME": "http://test.localhost",
    "GPII_OAUTH2_ACCESS_TOKEN_PATH": "/token",
    "GPII_OAUTH2_ADD_PREFERENCES_PATH": "/preferences",
    "GPII_OAUTH2_AUTH_GRANT_TYPE": "grant_type",
    "GPII_OAUTH2_AUTH_SCOPE": "auth_scope",
    "GPII_OAUTH2_AUTH_CLIENT_ID": "auth_client_id",
    "GPII_OAUTH2_AUTH_CLIENT_SECRET": "auth_client_secret"
};

gpii.tests.expectedEnvConfig = {
    "securityServer": {
        "port": "8888",
        "hostname": "http://test.localhost",
        "paths": {
            "token": "/token",
            "preferences": "/preferences"
        }
    },
    "authentication": {
        "grant_type": "grant_type",
        "scope": "auth_scope",
        "client_id": "auth_client_id",
        "client_secret": "auth_client_secret"
    }
};

jqUnit.test("gpii.firstDiscovery.server.config.getENV", function () {
    var env = gpii.tests.env();

    // register the environment variables
    env.set(gpii.tests.envToSet);

    var config = gpii.firstDiscovery.server.config.getENV(gpii.firstDiscovery.server.config.oauth2.clientCredential.ENVMap);
    jqUnit.assertDeepEq("The config should have been loaded from the environement variables", gpii.tests.expectedEnvConfig, config);

    // remove original environment variables
    env.remove();
});

jqUnit.test("gpii.firstDiscovery.server.config.getConfig", function () {
    jqUnit.expect(4);
    var env = gpii.tests.env();

    try {
        gpii.firstDiscovery.server.config.getConfig(
            missingConfigPath,
            gpii.firstDiscovery.server.config.oauth2.clientCredential.ENVMap,
            gpii.firstDiscovery.server.config.oauth2.clientCredential.schema
        );
    } catch (e) {
        jqUnit.assert("An error should have been thrown for the invalid config");
    }

    var configFile = gpii.firstDiscovery.server.config.getConfig(
        testConfigPath,
        gpii.firstDiscovery.server.config.oauth2.clientCredential.ENVMap,
        gpii.firstDiscovery.server.config.oauth2.clientCredential.schema
    );

    jqUnit.assertDeepEq("The config should have been loaded from the config file", expectedConfig, configFile);

    // register the environment variables
    env.set(gpii.tests.envToSet);

    var configEnv = gpii.firstDiscovery.server.config.getConfig(
        missingConfigPath,
        gpii.firstDiscovery.server.config.oauth2.clientCredential.ENVMap,
        gpii.firstDiscovery.server.config.oauth2.clientCredential.schema
    );

    jqUnit.assertDeepEq("The config should have been loaded from the environement variables", gpii.tests.expectedEnvConfig, configEnv);

    var configCombined = gpii.firstDiscovery.server.config.getConfig(
        testConfigPath,
        gpii.firstDiscovery.server.config.oauth2.clientCredential.ENVMap,
        gpii.firstDiscovery.server.config.oauth2.clientCredential.schema
    );

    jqUnit.assertDeepEq("The config should have been loaded with ENV taking precedence", gpii.tests.expectedEnvConfig, configCombined);

    // remove original environment variables
    env.remove();
});
