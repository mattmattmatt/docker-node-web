const express = require('express');
const fullConfig = require('./config');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const PORT = 80;
const env = process.env.NODE_ENV;

const config = env === 'production' ? fullConfig.production : fullConfig.development;

function callSendAPI(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: config.fbPageAcessToken },
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

function sendTextMessage(recipientId, messageText) {
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

function sendReadReceipt(recipientId) {
    console.log('Sending a read receipt to mark message as seen');

    var messageData = {
        recipient: {
            id: recipientId
        },
        sender_action: 'mark_seen'
    };

    callSendAPI(messageData);
}

function sendTypingOn(recipientId) {
    console.log('Turning typing indicator on');

    var messageData = {
        recipient: {
            id: recipientId
        },
        sender_action: 'typing_on'
    };

    callSendAPI(messageData);
}

function sendTypingOff(recipientId) {
    console.log('Turning typing indicator off');

    var messageData = {
        recipient: {
            id: recipientId
        },
        sender_action: 'typing_off'
    };

    callSendAPI(messageData);
}

function receivedMessage(event) {
    console.log('Message data: ', event.message);
    sendReadReceipt(event.sender.id);
    sendTypingOn(event.sender.id);
    setTimeout(() => {
        sendTypingOff(event.sender.id);
        sendTextMessage(event.sender.id, JSON.stringify(event.message));
    }, 1000);
}




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Force SSL
app.use('*', (req, res, next) => {
    if (env === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
        console.log('Redirecting unsecure request to HTTPS.', req.headers['user-agent'])
        res.redirect(`https://${req.hostname}${req.originalUrl}`);
    } else {
        next();
    }
});

app.get('/', function(req, res) {
    res.send('Chello efficient Docker world 2021!\n' + (new Date()).getTime());
});

app.get('/msg/webhook', function(req, res) {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === config.fbVerificationToken
    ) {
        console.log('Validated webhook');
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error('Failed validation. Make sure the validation tokens match.');
        res.sendStatus(403);
    }
});

app.post('/msg/webhook', function(req, res) {
    console.log('/msg/webhook', req.body);
    var data = req.body;

    if (data && data.object === 'page') {
        // Iterate over each entry - there may be multiple if batched
        data.entry.forEach(function(entry) {
            // Iterate over each messaging event
            entry.messaging.forEach(function(event) {
                if (event.message) {
                    receivedMessage(event);
                } else {
                    console.log('Webhook received unknown event: ', event);
                }
            });
        });
    }
    res.sendStatus(200);
});

app.listen(PORT);
console.log(`Ready to go 👻! Running on http://localhost:${PORT}, environment is ${env}`);
