const express = require('express');
const app = express();
const PORT = 80;
const env = process.env.NODE_ENV;

// Force SSL
app.get('*', (req, res, next) => {
    if (env === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
        console.log('Redirecting unsecure request to HTTPS.')
        res.redirect(`https://${req.hostname}${req.originalUrl}`);
    } else {
        next();
    }
});

app.get('/', function(req, res) {
    res.send('Chello world!\n' + (new Date()).getTime());
});

app.get('/msg/webhook', function(req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === 'THISISTHETOKEN') {
        console.log('Validating webhook');
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error('Failed validation. Make sure the validation tokens match.');
        res.sendStatus(403);
    }
});

app.listen(PORT);
console.log(`Ready to go 👻! Running on http://localhost:${PORT}, environment is ${env}`);
