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

require("gpii-express");
require("./dataSource.js");

fluid.defaults("gpii.firstDiscovery.server.preferences.handler", {
    gradeNames: ["gpii.express.handler"],
    components: {
        accessTokenDataSource: {
            type: "gpii.firstDiscovery.server.dataSource.security",
            options: {
                url: "http://10.0.2.2:8081/access_token"
            }
        },
        preferencesDataSource: {
            type: "kettle.dataSource.URL",
            options: {
                writable: true,
                url: "http://10.0.2.2:8081/add-preferences?view=%view",
                termMap: {
                    view: "%view"
                }
            }
        }
    },
    invokers: {
        handleRequest: {
            funcName: "gpii.firstDiscovery.server.preferences.handler.handleRequest",
            args:     ["{that}"]
        }
    }
});

gpii.firstDiscovery.server.preferences.prefrencesWrapper = {
    "contexts": {
        "gpii-default": {
            "name": "Default preferences",
            "preferences": {}
        }
    }
};

//TODO: This is just a rough in for the actual handler. This should be updated
// to contact the security layer to request creation of a gpii-token and saving
// of the prefrences set.
gpii.firstDiscovery.server.preferences.handler.handleRequest = function (that) {
    var view = that.request.query.view || "";
    var body = that.request.body || {};

    var accessTokenModel = {
        grant_type: "client_credentials",
        scope: "add_preferences",
        client_id: "client_first_discovery",
        client_secret: "client_secret_firstDiscovery"
    };

    var accessTokenPromise = that.accessTokenDataSource.set(null, accessTokenModel, {
        writeMethod: "POST"
    });

    accessTokenPromise.then(function (response) {
        var access = JSON.parse(response);

        var preferences = fluid.copy(gpii.firstDiscovery.server.preferences.prefrencesWrapper);
        fluid.set(preferences, ["contexts", "gpii-default", "preferences"], body);

        var preferencesPromise = that.preferencesDataSource.set({
            view: view
        }, preferences, {
            writeMethod: "POST",
            headers: {
                Authorization: access.token_type + " " + access.access_token
            }
        });

        preferencesPromise.then(function (response) {
            that.sendResponse(200, response);
        }, function (error) {
            var errorCode = error.statusCode || 500;
            that.sendResponse(errorCode, error);
        });

    }, function (error) {
        var errorCode = error.statusCode || 500;
        that.sendResponse(errorCode, error);
    });
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
