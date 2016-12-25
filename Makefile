build:
	@echo "Building..."
	docker build -t matt/node-web .
	@echo "Done."

upload:
	@echo "Uploading..."
	@scp -i "/Users/matt/Documents/code/iot/aws-matt-private.pem" index.js package.json Dockerfile Makefile ec2-user@ec2-54-166-217-62.compute-1.amazonaws.com:/home/ec2-user/docker-node-web
	@echo "Done."

stop-running:
	@-docker stop $(shell docker ps -f ancestor=matt/node-web -q)

run-local: build stop-running
	@docker run -d -i -t -p 8084:80 -v ${PWD}:/usr/app matt/node-web
	@echo "Docker image built and running locally."

run-prod: build stop-running
	@cd /home/ec2-user/docker-node-web
	@docker run -d -i -t -p 80:80 -e "NODE_ENV=production" -v ${PWD}:/usr/app matt/node-web
	@echo "Docker image built and running in production."

deploy: upload
	@ssh -i "/Users/matt/Documents/code/iot/aws-matt-private.pem" ec2-user@ec2-54-166-217-62.compute-1.amazonaws.com "cd docker-node-web && make run-prod"

log:
	docker logs --follow --tail 500 -t $(shell docker ps -f ancestor=matt/node-web -q)
