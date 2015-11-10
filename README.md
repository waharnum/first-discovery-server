# first-discovery-server

A server side implementation to serve a [First Discovery Editor](https://github.com/GPII/first-discovery) instance and provide a means for storing preferences to the [GPII](http://gpii.net) Preferences server.


## Development ##

Vagrant and Ansible configuration has been provided to make the setup of a development environment much simpler. During development you'll be able to work on your local machine but run virtual machine to host the actual server.

### Dependencies ###

* [Vagrant](https://www.vagrantup.com)

### Working with the VM ###

Once you've cloned the repository onto your local system you'll only need to run `vagrant up` to create the vm. The server will be accessible on your host machine at `http://localhost:8080`.

If you want to continuously copy over your files as you make edits on your host machine, run `vagrant rsync-auto`.
