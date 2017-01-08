import request from 'request';
import config from './config';

import { callSendAPI as csa } from './api';

export function callSendAPI(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: config().fbPageAcessToken },
        method: 'POST',
        json: messageData,

    }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const recipientId = body.recipient_id;
            const messageId = body.message_id;

            if (messageId) {
                console.log('Successfully sent message with id %s to recipient %s', messageId, recipientId);
            } else {
                console.log('Successfully called Send API for recipient %s', recipientId);
            }
        } else {
            console.error('Failed calling Send API', response.statusCode, response.statusMessage, body.error, messageData);
        }
    });
}

export function sendTextMessage(recipientId, messageText, isSilent) {
    const messageData = {
        recipient: {
            id: recipientId,
        },
        message: {
            text: messageText,
            metadata: 'DEVELOPER_DEFINED_METADATA',
        },
        notification_type: isSilent ? 'NO_PUSH' : 'REGULAR',
    };

    csa(messageData);
}

export function sendButtonMessage(recipientId) {
    const messageData = {
        recipient: {
            id: recipientId,
        },
        message: {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'button',
                    text: 'This is test text',
                    buttons: [{
                        type: 'postback',
                        title: 'Trigger Postback',
                        payload: 'DEVELOPER_DEFINED_PAYLOAD',
                    }, {
                        type: 'postback',
                        title: 'Trigger Postback',
                        payload: 'DEVELOPER_DEFINED_PAYLOAD',
                    }, {
                        type: 'postback',
                        title: 'Trigger Postback',
                        payload: 'DEVELOPER_DEFINED_PAYLOAD',
                    }],
                },
            },
        },
    };

    csa(messageData);
}
export function sendQuickReplyMessage(recipientId, text, quickReplies, isSilent) {
    if (!recipientId || !text || !quickReplies ||
        quickReplies.length < 1 || quickReplies.length > 11) {
        throw new Error(`sendQuickReplyMessage requires valid amount of quickReplies, was called with ${quickReplies.length}`);
    }
    const replies = quickReplies.map(reply => Object.assign({}, reply, {
        content_type: 'text',
    }));
    const messageData = {
        recipient: {
            id: recipientId,
        },
        message: {
            text,
            quick_replies: replies,
        },
        notification_type: isSilent ? 'NO_PUSH' : 'REGULAR',
    };

    csa(messageData);
}

export function sendReadReceipt(recipientId) {
    console.log('Sending a read receipt to mark message as seen');

    const messageData = {
        recipient: {
            id: recipientId,
        },
        sender_action: 'mark_seen',
    };

    csa(messageData);
}

export function sendTypingOn(recipientId) {
    console.log('Turning typing indicator on');

    const messageData = {
        recipient: {
            id: recipientId,
        },
        sender_action: 'typing_on',
    };

    csa(messageData);
}

export function sendTypingOff(recipientId) {
    console.log('Turning typing indicator off');

    const messageData = {
        recipient: {
            id: recipientId,
        },
        sender_action: 'typing_off',
    };

    csa(messageData);
}
