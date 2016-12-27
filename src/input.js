import * as api from './api';

export function receivedMessage(event) {
    console.log('Message data: ', event.message);
    api.sendReadReceipt(event.sender.id);
    api.sendTypingOn(event.sender.id);
    setTimeout(() => {
        // sendTypingOff(event.sender.id);
        api.sendTextMessage(event.sender.id, 'Haha, ' + event.message.text + ' 😂');
        setTimeout(() => {
            // sendButtonMessage(event.sender.id);
            api.sendQuickReplyMessage(event.sender.id);
        }, 3000);
    }, 2000);
}
