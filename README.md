# first-discovery-server

A server side implementation to serve a [First Discovery Editor](https://github.com/GPII/first-discovery) instance and provide a means for storing preferences to the [GPII](http://gpii.net) Preferences server.

## Usage ##

By default the server will run from port 8088, see [Configuration](#configuration) to use a different port.
The First Discovery Tool will be reachable off of the /demos path e.g. http://localhost:8088/demos/prefsServerIntegration

### Configuration ###

The First Discovery Server can be configured via [Kettle Configs](https://github.com/amb26/kettle/blob/KETTLE-32/README.md#structure-of-a-kettle-config). A set of these are provided with the server in the [config](./src/config) directory.

The [`gpii.firstDiscovery.server.configurator`](./src/js/firstDiscoveryServer.js) grade defines a default schema for which the configuration is validated against. If the validation fails, the application will throw and error.

### Launching ###

The First Discovery Server can be launched as a Kettle application by making use of [Kettle Configs](https://github.com/amb26/kettle/blob/KETTLE-32/README.md#structure-of-a-kettle-config).

There are two typical ways of launching a Kettle app, programmatically and from command line

(See: [Starting a Kettle application](https://github.com/amb26/kettle/blob/KETTLE-32/README.md#starting-a-kettle-application))

#### Programmatically ####

```javascript
// require the kettle module
var kettle = require("kettle");

// load the config
kettle.config.loadConfig({
    // path to the config directory
    configPath:"./src/config",

    // name of the config to load, without the file extension
    configName: "vagrant"
});
```

#### Command Line #####

```bash
# Call Kettle's init.js script with the
# configPath and configName
node node_modules/kettle/init.js <configPath> [<configName>]

# or using an environment variable to specify
# the configName
NODE_EVN=<configName> node node_modules/kettle/init.js <configPath>
```

### Resources ####

<table>
    <thead>
        <tr>
            <th>URL</th>
            <th>Request</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>/user?[view=:view]</code></td>
            <td><code>POST</code></td>
            <td>
                Accepts a set of preferences, in a JSON object, to be stored on the preferences server. A GPII token will be returned and can be used for retrieving the preferences on a GPII enabled device. The <code>view</code> query parameter is used to specify which ontology the preferences are stored in. (See: <a href="https://github.com/GPII/universal/blob/master/documentation/PreferencesServer.md#post-preferencesviewview">Prefrences Server</a>)
            </td>
        </tr>
    </tbody>
</table>

## Development ##

Vagrant and Ansible configuration has been provided to make the setup of a development environment much simpler. During development you'll be able to work on your local machine and run a virtual machine to host the actual server.

### Dependencies ###

* [Vagrant](https://www.vagrantup.com)
* [VirtualBox](https://www.virtualbox.org)

### Working with the VM ###

Once you've cloned the repository onto your local system you'll only need to run `vagrant up` to create the vm. By default, the server will be accessible on your host machine at `http://localhost:8088`. (e.g. `http://localhost:8088/demos`).

_**NOTE**: If you changed the port option, `nodejs_app_tcp_port`, in the [vars.yml](provisioning/vars.yml) file or 8088 is already in use on your host machine, the actual URL may be different._

Logs output by the VM can be viewed in a web browser at `http://127.0.0.1:19531/entries?_EXE=/usr/bin/node&follow`.

### Secrets ###

the `client_id` and `client_secret` are confidential and should not be committed. You can pass these values in with environment variables to the VM or making use a config file that isn't committed.
