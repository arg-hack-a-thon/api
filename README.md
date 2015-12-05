# API

## Getting Started

1. Install dependencies 
	
	- Download and install Docker Toolbox. 
	
	- Make sure you have node version 4.x


2. Setup new docker machine

    ```
    docker-machine create --driver=virtualbox default
    eval "$(docker-machine env default)"
    ```

3. Install Docker Rsync

    ```
    brew tap synack/docker
    brew install docker-rsync
    ```

4. Set the configuration
	
	```
	ln -s ./envs/.envvars.local .envvars
	```


5. Edit Host file

    ```
    echo "$(docker-machine ip default) docker.local" > /tmp/whatever; sudo sh -c "cat /tmp/whatever >> /etc/hosts"
    ```

6. Start API Server

    ```
    cd <path_to_cloned_stuff>/api
    make sync
    # Then on a new tab you must
    make up
    ```

## Workflow

### Stop working
	
When you want to stop the intermediate machine
	
	docker-machine stop default
	

### Resume working

When you want to start the intermediate machine

	docker-machine start default


### Installing new NPM modules

npm modules live inside of the container so you must
	
	# run docker ps and get the dockerID - in this case the API machine (api_api)
    docker ps    
    # get inside the container by running
    docker exec -it <dockerID> bash
    # install the npm dependencies you need 
    npm install --save [package-name]
    # Then check the package.json
    cat package.json
    # copy the contents, and replace/update the package.json on your host machine
    
    
    
   
    