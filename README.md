# Getting Started

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

4. Edit Host file

    ```
    echo "$(docker-machine ip default) docker.local" > /tmp/whatever; sudo sh -c "cat /tmp/whatever >> /etc/hosts"
    ```

5. Start API Server

    ```
    cd <path_to_cloned_stuff>/api
    make sync
    # Then on a new tab you must
    make up
    ```

# Work flow

### Stop working

```
docker-machine stop default
```

### Resume working

```
docker-machine start default
```