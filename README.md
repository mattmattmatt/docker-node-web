# docker-node-web

**This Docker image with a node webserver running inside provides a Facebook messenger chatbot that translates specific text messages into MQTT messages for controlling home automation systems.**

## Development & deployment

It's all in the `Makefile`. Run `make local` to start a local Docker image with the server available at [http://localhost:8084](http://localhost:8084). Run `make log` to inspect the node logs, run `make stop` to [make it stop](http://www.reactiongifs.com/wp-content/uploads/2012/11/MakeItStop.gif).

Running `make deploy` will upload all source files to your EC2 machine and start the Docker image there. It'll be available at port `80` as well under the machine's hostname, e.g. `ec2-123456.compute-1.amazonaws.com`.
 
### Prerequisites 
 
Ensure you have a file `/src/config.js` that provides something like this:

```JS
// /src/config.js

const fullConfig = {
    production: {
        fbVerificationToken: '1234567890987654321',
        fbPageAcessToken: 'asdfghjkl',
        mqtt: {
            username: 'matt',
            password: '123456',
            host: 'mqtt.mosquitto.org',
            port: '8883',
        },
    },
    development: {
        fbVerificationToken: '1234567890987654321',
        fbPageAcessToken: 'asdfghjk',
        mqtt: {
            username: 'matt',
            password: '123456',
            host: 'mqtt.mosquitto.org',
            port: '8883',
        },
    },
};

export default function config() {
    return process.env.NODE_ENV === 'production' ? fullConfig.production : fullConfig.development;
}
```
