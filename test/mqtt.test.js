const mqtt = require('../dist/mqtt');

beforeEach(() => {
});

describe('MQTT', () => {
    describe('send', () => {
        it('sends a test message', () => mqtt.send('test/test', 'test').then(([topic, payload]) => {
            expect(topic).toBe('test/test');
            expect(payload).toBe('test');
        }));
    });
});
