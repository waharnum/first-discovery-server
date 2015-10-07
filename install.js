/*
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/fluid-project/first-discovery-server/raw/master/LICENSE.txt
*/

"use strict";

var child_process = require("child_process");

// Using spawn instead of exec so that the output stream can be piped to
// the parent process's stdio. Also it avoids overrunning the buffer that exec
// requires.
var spawn = function (command, args) {
    return child_process.spawn(command, args, {stdio: "inherit"});
};

// spawns the npm install
// Need to use --force to ensure that "dedupe-infusion" failures from gpii-express
// do not prevent its installation. The dedupe-infusion postinstall task in gpii-express
// is currently failing because the grunt-gpii dependency is not installed before
// the postinstall script is run.
var npm = spawn("npm", ["install", "--force"]);

npm.on("close", function (exitCode) {
    // if npm process exited normally
    if (exitCode !== null) {
        // spawns the deduplication
        var dedupe = spawn("grunt", ["dedupe-infusion"]);
        dedupe.on("close", function (exitCode) {
            // if dedupe process exited normally
            if (exitCode !== null) {
                // spanws the reinstall of first-discovery
                // first-discovery also depends on Infusion and contains a copy of
                // Infusion wihtin its lib directory.
                // When the deduplication process is run, this copy of Infusion
                // is also removed. However, because first-discovery runs on the client
                // and does not make use of "require" it cannot locate the copy of Infusion.
                // The reinstallation of first-discovery puts back its copy of Infusion.
                spawn("grunt", ["npm-install:first-discovery"]);
            }
        });
    }
});
