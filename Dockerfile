FROM node:alpine

# Create app directory
RUN mkdir -p /usr/app
WORKDIR /usr/app

EXPOSE 80
CMD [ "npm", "install" ]
CMD [ "npm", "start" ]
