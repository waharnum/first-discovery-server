# first-discovery-server

A server side implementation to serve a [First Discovery Editor](https://github.com/GPII/first-discovery) instance and provide a means for storing preferences to the [GPII](http://gpii.net) Preferences server.

## Usage ##

By default the server will run from port 8088, but can be configured to use a different port by setting the FIRST_DISCOVERY_SERVER_TCP_PORT environment variable to a different port number.

```bash
# changing the server's port number
FIRST_DISCOVERY_SERVER_TCP_PORT=8088

#launching the server
node index.js
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
            <td><code>/demos/...<code></td>
            <td><code>GET</code></td>
            <td>
                The First Discovery Tool's demos are served up from this root directory. The exact path to files will depend on the structure of the demos.
                <em>(See: <a href="https://github.com/gpii/first-discovery">first-discovery</a>)</em>
            </td>
        </tr>
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

### Working with the VM ###

Once you've cloned the repository onto your local system you'll only need to run `vagrant up` to create the vm. By default, the server will be accessible on your host machine at `http://localhost:8088`. (e.g. `http://localhost:8088/demos`).

**_NOTE_: If you changed the port option, `nodejs_app_tcp_port`, in the vars.yml file or 8088 is already in use on your host machine, the actual URL may be different.**

Logs output by the VM can be viewed in a web browser at `http://127.0.0.1:19531/entries?_EXE=/usr/bin/node&follow`.
