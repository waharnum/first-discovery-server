/*
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/GPII/first-discovery-server/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");
var ajv = require("ajv");
var $ = fluid.registerNamespace("jQuery");
var gpii = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.firstDiscovery.server.config.oauth2.clientCredential");

/**
 * Attemps to load a config file, will return an empty object {} if the file
 * cannot be located.
 *
 * @param file {String} - path to the config file
 * @return {Object} - the JSON object representation of the JSON file, default is {}
 */
gpii.firstDiscovery.server.config.getConfigFile = function (file) {
    var config = {};
    try {
        config = require(file);
    } catch (e) {
        console.log(file + " not found.");
    }
    return config;
};

/**
 * Transforms an EnvMap into a config object
 *
 * @param EnvMap {Object} - a map of Environment variables that is transformed into a
 *                          configuration object.
 * @returns {Object} - the configuration object
 */
gpii.firstDiscovery.server.config.getEnv = function (EnvMap) {
    return fluid.transform(EnvMap, function (Env) {
        if (fluid.isPlainObject(Env)) {
            return gpii.firstDiscovery.server.config.getEnv(Env);
        } else {
            return process.env[Env];
        }
    });
};

/**
 * Returns the configuration object sourced from a configuration file and/or a
 * set of environment variables. The environment variables take highest precedence
 * and will override any value specified in the configuration file. Providing a
 * schema will validate the resulting configuration object and will throw an error
 * if the configuraiton is invalid. This is useful to ensure that the values are
 * of the correct type and that all required properties are provided.
 *
 * @param file {String} - path to the config file
 * @param EnvMap {Object} - a map of Environment variables that is transformed into a
 *                          configuration object.
 * @param schema {Object} - a JSON schema document based on AJV (see: https://github.com/epoberezkin/ajv)
 * @returns {Object} - the combined and validated configuraiton object
 */
gpii.firstDiscovery.server.config.getConfig = function (file, EnvMap, schema) {
    var validator = ajv();
    var configFile = gpii.firstDiscovery.server.config.getConfigFile(file);
    var envConfig = gpii.firstDiscovery.server.config.getEnv(EnvMap);
    var config = $.extend(true, {}, configFile, envConfig);
    var isValid = validator.validate(schema, config);

    console.log("isValid: ", isValid, "config:", JSON.stringify(config));

    if (isValid) {
        return config;
    } else {
        throw new Error(validator.errorsText());
    }
};

gpii.firstDiscovery.server.config.oauth2.clientCredential.EnvMap = {
    "securityServer": {
        "port": "GPII_OAUTH2_TCP_PORT",
        "hostname": "GPII_OAUTH2_HOST_NAME",
        "paths": {
            "token": "GPII_OAUTH2_ACCESS_TOKEN_PATH",
            "preferences": "GPII_OAUTH2_ADD_PREFERENCES_PATH"
        }
    },
    "authentication": {
        "grant_type": "GPII_OAUTH2_AUTH_GRANT_TYPE",
        "scope": "GPII_OAUTH2_AUTH_SCOPE",
        "client_id": "GPII_OAUTH2_AUTH_CLIENT_ID",
        "client_secret": "GPII_OAUTH2_AUTH_CLIENT_SECRET"
    }
};

gpii.firstDiscovery.server.config.oauth2.clientCredential.schema = {
    "required": ["securityServer", "authentication"],
    "properties": {
        "securityServer": {
            "required": ["port", "hostname", "paths"],
            "properties": {
                "port": {"type": "string"},
                "hostname": {"type": "string"},
                "paths": {
                    "required": ["token", "preferences"],
                    "properties": {
                        "token": {"type": "string"},
                        "preferences": {"type": "string"}
                    }
                }
            }
        },
        "authentication": {
            "required": ["grant_type", "scope", "client_id", "client_secret"],
            "properties": {
                "grant_type": {"type": "string"},
                "scope": {"type": "string"},
                "client_id": {"type": "string"},
                "client_secret": {"type": "string"}
            }
        }
    }
};
