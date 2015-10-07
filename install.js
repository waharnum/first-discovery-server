/*
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/fluid-project/first-discovery-server/raw/master/LICENSE.txt
*/

"use strict";

var child_process = require("child_process");

// spawns the npm install
// need to use --force to ensure that "dedupe-infusion" failures from gpii-express
// do not prevent its installation.
var npm = child_process.spawn("npm", ["install", "--force"], {stdio: "inherit"});

npm.on("close", function (exitCode) {
    // if npm process exited normally
    if (exitCode !== null) {
        // spawns the deduplication
        var dedupe = child_process.spawn("grunt", ["dedupe-infusion"], {stdio: "inherit"});
        dedupe.on("close", function (exitCode) {
            // if dedupe process exited normally
            if (exitCode !== null) {
                // spanws the re-install of first-discovery
                // this is needed because the deduplication removes its version of
                // infusion as well, despite the fact that first-discovery only
                // runs in the client
                child_process.spawn("grunt", ["npm-install:first-discovery"], {stdio: "inherit"});
            }
        });
    }
});
