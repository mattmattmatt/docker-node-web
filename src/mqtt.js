import mqtt from 'mqtt';
import fs from 'fs';
import Promise from 'promise';
import config from './config';

const clientOptions = {
    protocol: 'mqtts',
    host: config().mqtt.host,
    port: config().mqtt.port,
    username: config().mqtt.username,
    password: config().mqtt.password,
    ca: [fs.readFileSync('./certificates/ca.crt')],
    rejectUnauthorized: true,
};

const publishOptions = {
    qos: 2,
};

export default function send(topic, payload) {
    return new Promise((resolve, reject) => {
        if (!topic) {
            reject('No topic specified.');
            return;
        }
        if (typeof payload !== 'string' && typeof payload !== 'undefined') {
            reject('Payload must be a string or undefined.');
            return;
        }
        const client = mqtt.connect(clientOptions);
        console.log('Sending MQTT message:', topic, payload);

        client.on('connect', () => {
            client.publish(topic, payload, publishOptions,
                () => {
                    client.end();
                    resolve([topic, payload]);
                });
        });

        client.on('error', (e) => {
            client.end();
            reject(e);
        });
    });
}
