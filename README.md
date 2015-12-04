# API

## Local Development Setup

First, you will need to have a working Docker Host setup on your local machine. We have chosen to stick with using [Vagrant](https://www.vagrantup.com/) for setting up and orchestrating our local Docker deployment. This choice was made due to Vagrant's ability to also manage file synchronization between the the developer's local machine and the Docker Host.

### Dependencies

#### Get Vagrant + Virtualbox

Head on over to http://vagrantup.com and download the [latest](https://www.vagrantup.com/downloads.html) version of Vagrant.

You will also need to download the [latest](https://www.virtualbox.org/wiki/Downloads) version of Virtualbox.

##### On Windows

You should also get [Cygwin](https://cygwin.com/) to be able to execute most of the Linux-like commands.

#### Rsync

Part of the development workflow of using Vagrant managed VMs for development is making sure that your code from you local is sync'd into the VM, and re-sync'd every time a change is made.

Helpi uses the built in rsync capabilities that ship in Vagrant to do this. In order to use these features, you will need to have `rsync` installed on your local machine. OS X ships with a version pre-installed. Linux users may need to install it with a package manager.

##### On Windows

Use [Chocolatey](https://chocolatey.org/) to install the rsync package by running the:

```bash
choco install rsync
```

#### Docker

You should install the Docker client on your local machine so you can use it to interact with the Docker host that is built.

##### On OS X

Use [Homebrew](http://brew.sh/) to install the Docker CLI by running the:

```bash
brew install docker
```

##### On Windows

Use [Chocolatey](https://chocolatey.org/) to install the Docker CLI package by running the:

```bash
choco install docker
```

### Setting up your Docker Host

A starter project has been setup for creating a Docker Host in the following repo:

https://github.com/zehnergroup/zg-boot2docker

Please follow the README in that repo to get your Docker Host setup.

### Pre-Deployment Steps

Docker relies heavily on Environment Variables to passing config into the container. Before deploying your containers to the Docker Host, you will need to create a symlink to the appropriate .envvar file for local development.

From the project root, run:

```
ln -s ./envs/.envvars.local .envvars
```

### Fire it up

From the project root, run:

```bash
vagrant up --no-parallel
```

### Access app

You should now be able to access the hello world module that the skeleton ships with by going to http://docker.local:8006/hello.

## Local Development Tasks

### Get your container ID

Run the following:

```bash
docker ps
```

Look for the line that is running an image named `zehnergroup/zg-site:latest` and note the container ID that preceeds it.

### Follow Logs

You'll likely want to watch logs on the container. Run the following:

```bash
docker logs -f <CONTAINER_ID>
```

### Connect to running container

After running `docker ps` you will be able to see the container ID of the running app container. To open a shell into the running container, run:

```bash
docker exec -it <CONTAINER_ID> bash
```

### Syncing files to the Container

The Vagrant config will rsync the application to the Docker host, and mount the rsync'd folder to the container as a Volume.

To make sure that you file changes are sent to the Container, you should run the following and it will stay running, watching the project folder for changes and syncing them.

```bash
vagrant rsync-auto
```

### Installing NPM Modules

Get a shell inside the container, and use `npm install --save MODULE` or `npm install --save-dev MODULE` to install it inside the container.

**IMPORTANT NOTE:** Since `vagrant rsync-auto` is not bi-directional, after you are done installing, make sure you bring the modified `package.json` back to the host by copying the output of `cat package.json` and pasting it into your local file system so it can be comitted to Git.

### Debugging

A debugger is ready to go inside the container. It is setup to start in the local and development environments. It will be initiaited on start of the server as long as the following env var (in `/envs/.envvars.local`) is present:

```bash
export DEBUGGER=true
```

Once the app has been started with the Debugger turned on, you can connect to the debugger at the following URL:

http://docker.local:8386/debug?ws=docker.local:8386&port=5356

## Database Migrations

Sequelize has support for Database Migration. All changes to the DB should be scripted via Migrations.

Migrations are places in the `./migrations` directory.

Please make sure that you incrementally name your migration files like so:

```
0000-migration-1.js
0001-migration-2.js
0002-migration-3.js
```

**IMPORTANT NOTE:** Migrations and database schema changes are sensitive changes in application development. If multiple developers are working on features that require database migrations, they should be careful to coordinate with each other to make sure that their migrations are running in the proper order, and do not conflict with each other.

### Running Migrations

Migrations are run inside the container. To run them, `docker exec` into the container and use the `sequelize` CLI to run them.

```bash
# From your local host
docker exec -it <container_id> bash

# Once inside the container
source .envvars
sequelize db:migrate
```

## CI/CD Pipeline

The project has been built out with a Continuous Integration and Delivery pipeline. This is being handled primarily by Jenkins. You can access the Jenkins server here:

http://ec2-54-69-247-114.us-west-2.compute.amazonaws.com:8080/

**NOTE** You will need to be a member of the `ElementzInteractive` GitHub organization to access

The current flow works like this:


> When a new commit hit the `dev` branch of this repo, Jenkins is notified and pulls the latest version of that branch. It then runs a Docker build process by building an image via the `Dockerfile` in this repo, and then runs the `npm test` command to run various tests on a running container.

> If those tests pass, the built image is pushed up to [Tutum](https://www.tutum.co/). Tutum then redploys the image, replacing the old version of the container.
