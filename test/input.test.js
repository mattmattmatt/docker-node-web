const api = require('../dist/api');
const input = require('../dist/input');

api.sendQuickReplyMessage = jest.fn();
api.sendTextMessage = jest.fn();

beforeEach(() => {});

describe('Input', () => {
    describe('receivedMessage', () => {
        it('runs', () => {
            input.receivedMessage({
                message: {
                    text: '1234',
                },
                sender: {
                    id: 12,
                },
            });
        });
    });

    describe('getMessageHandler', () => {
        it('returns lights', () => {
            expect(input.getMessageHandler('something with lights in there')).toBe(input.handlers[0].handler);
        });
        it('returns confusion', () => {
            expect(input.getMessageHandler('something with nothing in there')).toBe(input.handlers[input.handlers.length - 1].handler);
        });
    });
});
