const input = require('../dist/input');

beforeEach(() => {
});


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
});
