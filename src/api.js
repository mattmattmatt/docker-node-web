import request from 'request';
import config from './config';

function callSendAPI(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: config().fbPageAcessToken },
        method: 'POST',
        json: messageData

    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;

            if (messageId) {
                console.log('Successfully sent message with id %s to recipient %s', messageId, recipientId);
            } else {
                console.log('Successfully called Send API for recipient %s', recipientId);
            }
        } else {
            console.error('Failed calling Send API', response.statusCode, response.statusMessage, body.error);
        }
    });
}

export function sendTextMessage(recipientId, messageText) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText,
            metadata: 'DEVELOPER_DEFINED_METADATA'
        }
    };

    callSendAPI(messageData);
}

export function sendButtonMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
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
                        payload: 'DEVELOPER_DEFINED_PAYLOAD'
                    }, {
                        type: 'postback',
                        title: 'Trigger Postback',
                        payload: 'DEVELOPER_DEFINED_PAYLOAD'
                    }, {
                        type: 'postback',
                        title: 'Trigger Postback',
                        payload: 'DEVELOPER_DEFINED_PAYLOAD'
                    }, ]
                }
            }
        }
    };

    callSendAPI(messageData);
}
export function sendQuickReplyMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: 'Pick a color:',
            quick_replies: [
                {
                    content_type: 'text',
                    title: 'Red',
                    payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED'
                },
                {
                    content_type: 'text',
                    title: 'Green',
                    payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN'
                },
                {
                    content_type: 'text',
                    title: 'Red',
                    payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED'
                },
                {
                    content_type: 'text',
                    title: 'Green',
                    payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN'
                },
                {
                    content_type: 'text',
                    title: 'Red',
                    payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED'
                },
                {
                    content_type: 'text',
                    title: 'Green',
                    payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN'
                },
                {
                    content_type: 'text',
                    title: 'Red',
                    payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED'
                },
                {
                    content_type: 'text',
                    title: 'Green',
                    payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN'
                },
                {
                    content_type: 'text',
                    title: 'Red',
                    payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED'
                },
                {
                    content_type: 'text',
                    title: 'Green',
                    payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN'
                },
                {
                    content_type: 'text',
                    title: 'Red',
                    payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED'
                },
            ]
        }
    };

    callSendAPI(messageData);
}

export function sendReadReceipt(recipientId) {
    console.log('Sending a read receipt to mark message as seen');

    var messageData = {
        recipient: {
            id: recipientId
        },
        sender_action: 'mark_seen'
    };

    callSendAPI(messageData);
}

export function sendTypingOn(recipientId) {
    console.log('Turning typing indicator on');

    var messageData = {
        recipient: {
            id: recipientId
        },
        sender_action: 'typing_on'
    };

    callSendAPI(messageData);
}

export function sendTypingOff(recipientId) {
    console.log('Turning typing indicator off');

    var messageData = {
        recipient: {
            id: recipientId
        },
        sender_action: 'typing_off'
    };

    callSendAPI(messageData);
}
