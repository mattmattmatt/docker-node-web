import express from 'express';
import config from './config';
import bodyParser from 'body-parser';
import * as input from './input';
const app = express();
const PORT = 80;
const env = process.env.NODE_ENV;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Force SSL
app.use('*', (req, res, next) => {
    if (env === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
        console.log('Redirecting unsecure request to HTTPS.', req.headers['user-agent'])
        res.redirect(301, `https://${req.hostname}${req.originalUrl}`);
    } else {
        next();
    }
});

app.get('/', function(req, res) {
    res.send('Chello efficient Docker world 2021!\n' + (new Date()).getTime());
});

app.get('/msg/webhook', function(req, res) {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === config().fbVerificationToken
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
                    input.receivedMessage(event);
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
