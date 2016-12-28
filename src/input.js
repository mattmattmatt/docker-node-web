import * as api from './api';

export function receivedMessage(event) {
    console.log('Received message data: ', event.message);
    api.sendReadReceipt(event.sender.id);
    api.sendTypingOn(event.sender.id);
    // api.sendTypingOff(event.sender.id);
    api.sendTextMessage(event.sender.id, `Haha, ${event.message.text} 😂`);
    // api.sendButtonMessage(event.sender.id);
    // api.sendQuickReplyMessage(event.sender.id);
}
