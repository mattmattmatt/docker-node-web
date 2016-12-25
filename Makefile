RUNNER = $(shell docker ps | grep "80\/tcp" | cut -f1 -d" ")

echo:
	@echo "Runner: ${RUNNER}."

build:
	@echo "Building..."
	docker build -t matt/node-web .
	@echo "Building done."

upload:
	@echo "Uploading..."
	@scp -r -i "/Users/matt/Documents/code/iot/aws-matt-private.pem" src/ package.json Dockerfile Makefile ec2-user@ec2-54-166-217-62.compute-1.amazonaws.com:/home/ec2-user/docker-node-web/
	@echo "Uploading done."

stop:
	@if [ -n "${RUNNER}" ]; then echo "Stopping ${RUNNER}..."; docker stop ${RUNNER}; else echo "No currently running containers."; fi;

local: build stop
	@docker run -d -i -t -p 8084:80 matt/node-web npm start
	@echo "Docker image built and running locally."

prod: build stop
	@cd /home/ec2-user/docker-node-web
	@docker run -d -i -t -p 80:80 -e "NODE_ENV=production" matt/node-web npm start
	@echo "Docker image built and running in production."

deploy: upload
	@ssh -i "/Users/matt/Documents/code/iot/aws-matt-private.pem" ec2-user@ec2-54-166-217-62.compute-1.amazonaws.com "cd docker-node-web && make prod"

log:
	docker logs --follow --tail 500 -t $(shell docker ps -f ancestor=matt/node-web -q)
