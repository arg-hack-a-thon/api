.PHONY: up sync

up:
	docker-compose up

sync:
	docker-rsync -dst /projects/ default
