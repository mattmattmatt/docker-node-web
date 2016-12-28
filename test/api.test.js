const api = require('../dist/api');

beforeEach(() => {
    api.callSendAPI = jest.fn();
});

describe('API', () => {
    describe('sendQuickReplyMessage', () => {
        it('fires a good call', () => {
            api.sendQuickReplyMessage('12345', 'do the thing', [{
                title: 'title',
                payload: 'payload',
            }]);
            expect(api.callSendAPI).toHaveBeenCalledTimes(1);
            expect(api.callSendAPI).toHaveBeenLastCalledWith({
                recipient: {
                    id: '12345',
                },
                message: {
                    text: 'do the thing',
                    quick_replies: [{
                        title: 'title',
                        payload: 'payload',
                        content_type: 'text',
                    }],
                },
            });
        });
        it('fires some bad calls', () => {
            expect(() => { api.sendQuickReplyMessage('2345', 'do the thing', []); }).toThrow();
            expect(() => { api.sendQuickReplyMessage('2345', 'do the thing', undefined); }).toThrow();
            expect(() => { api.sendQuickReplyMessage('2345', undefined, []); }).toThrow();
            expect(() => { api.sendQuickReplyMessage(undefined, 'do the thing', []); }).toThrow();
        });
    });
});
