import * as api from './api';

export const handlers = [
    {
        regex: /.*\s?lights?(\s.+)?$/i,
        handler: {
            handleMessage: (text, recipientId) => {
                console.log(text, recipientId);
                if (text.match(/^\s*lights\s*$/i)) {
                    api.sendQuickReplyMessage(recipientId, 'What should I do with the lights?', [
                        {
                            title: 'On',
                            payload: 'lights on',
                        },
                        {
                            title: 'Off',
                            payload: 'lights off',
                        },
                        {
                            title: 'Reading',
                            payload: 'lights reading',
                        },
                    ]);
                } else {
                    api.sendTextMessage(recipientId, 'Ok 👍');
                }
            },
        },
    },
    {
        regex: /.+/i,
        handler: {
            handleMessage: (text, recipientId) => {
                api.sendTextMessage(recipientId, 'Not sure what you mean 🤔');
            },
        },
    },
];

export function getMessageHandler(text) {
    return (handlers.find(handler => text.match(handler.regex) !== null) || {}).handler || {
        handleMessage: () => {},
    };
}

export function receivedMessage(event) {
    console.log('Received message data: ', event.message);
    let text;
    api.sendReadReceipt(event.sender.id);
    api.sendTypingOn(event.sender.id);
    if (event.message.quick_reply && event.message.quick_reply.payload) {
        text = event.message.quick_reply.payload;
    } else {
        text = event.message.text;
    }
    getMessageHandler(text).handleMessage(text, event.sender.id);
}
