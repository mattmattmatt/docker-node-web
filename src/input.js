import * as api from './api';
import sendMqtt from './mqtt';

function sendDefaultMessage(recipientId) {
    api.sendQuickReplyMessage(recipientId, 'What can I help you with?', [
        {
            title: 'Lights',
            payload: 'Lights',
        },
        {
            title: 'Tunes',
            payload: 'Play music',
        },
        {
            title: 'Shows',
            payload: 'tv shows',
        },
        {
            title: 'Movie',
            payload: 'movie',
        },
        {
            title: 'Volume',
            payload: 'Volume',
        },
        {
            title: 'Controls',
            payload: 'Music',
        },
        {
            title: 'TV',
            payload: 'TV',
        },
        {
            title: 'Wake',
            payload: 'morning',
        },
        {
            title: 'Sleep',
            payload: 'sleep',
        },
        {
            title: 'Coming',
            payload: 'Coming home',
        },
        {
            title: 'Leaving',
            payload: 'Leaving home',
        },
    ], true);
}

function sendOk(recipientId, message) {
    api.sendTextMessage(recipientId, message || 'Done 👍');
    setTimeout(sendDefaultMessage, 500, recipientId);
}

export const handlers = [
    {
        regex: /.*\s?lights?(\s.+)?/i,
        handler: {
            handleMessage: (text, recipientId) => {
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
                            title: 'Bright',
                            payload: 'lights bright',
                        },
                        {
                            title: 'Reading',
                            payload: 'lights reading',
                        },
                        {
                            title: 'Relax',
                            payload: 'lights relax',
                        },
                        {
                            title: 'Bedtime',
                            payload: 'lights bedtime',
                        },
                        {
                            title: 'Movies',
                            payload: 'lights movie',
                        },
                        {
                            title: 'Red',
                            payload: 'lights red',
                        },
                        {
                            title: 'Minimal',
                            payload: 'lights minimal',
                        },
                        {
                            title: 'Party',
                            payload: 'lights party',
                        },
                    ]);
                } else {
                    sendMqtt('events/lights/scene', text.replace(/.*lights?\s?/i, '')).then(() => {
                        sendOk(recipientId);
                    });
                }
            },
        },
    },
    {
        regex: /.*\s?tv\s(shows?|episodes?)(\s.+)?/i,
        handler: {
            handleMessage: (text, recipientId) => {
                sendMqtt('events/watch/tvshow').then(() => {
                    sendOk(recipientId, 'Let\'s watch something!');
                });
            },
        },
    },
    {
        regex: /(.+\s)?movies?(\s.+)?/i,
        handler: {
            handleMessage: (text, recipientId) => {
                sendMqtt('events/watch/movie').then(() => {
                    sendOk(recipientId, 'Let\'s watch a movie! 🎬');
                });
            },
        },
    },
    {
        regex: /(.+\s)?(music|song)(\s.+)?/i,
        handler: {
            handleMessage: (text, recipientId) => {
                if (text.match(/(.+\s)?((play|listen|turn on).+music|play a song|make.+noise)(\s.+)?/i)) {
                    sendMqtt('events/music/play').then(() => {
                        sendOk(recipientId, 'Tunes coming up! 🎵🎶🎵');
                    });
                } else if (text.match(/(.+\s)?((stop|kill|turn off).+music)(\s.+)?/i)) {
                    sendMqtt('events/kodi/execute', 'stop').then(() => {
                        sendOk(recipientId, 'Silence it is. 🤐');
                    });
                } else if (text.match(/next/i)) {
                    sendMqtt('events/kodi/execute', 'next').then(() => {
                        sendOk(recipientId, '⏭');
                    });
                } else if (text.match(/last|previous|prev|back/i)) {
                    sendMqtt('events/kodi/execute', 'previous').then(() => {
                        sendOk(recipientId, '⏮');
                    });
                } else if (text.match(/^\s?music\s?$/i)) {
                    api.sendQuickReplyMessage(recipientId, 'What\'s up with the music?', [
                        {
                            title: '⏮',
                            payload: 'previous song',
                        },
                        {
                            title: '▶️',
                            payload: 'play music',
                        },
                        {
                            title: '⏹',
                            payload: 'stop music',
                        },
                        {
                            title: '⏭',
                            payload: 'next song',
                        },
                        {
                            title: 'Volume',
                            payload: 'volume',
                        },
                        {
                            title: 'Reset Kodi',
                            payload: 'Reset Kodi',
                        },
                    ]);
                }
            },
        },
    },
    {
        regex: /.*\s?tv(\s.+)?/i,
        handler: {
            handleMessage: (text, recipientId) => {
                if (text.match(/^\s*tv\s*$/i)) {
                    sendMqtt('events/tv', '2').then(() => {
                        sendOk(recipientId, 'I toggled the TV! 📺');
                    });
                } else if (text.match(/^\s*tv\s+on\s*$/i)) {
                    sendMqtt('events/tv', '1').then(() => {
                        sendOk(recipientId, 'Turning TV on... 📺');
                    });
                } else {
                    sendMqtt('events/tv', '0').then(() => {
                        sendOk(recipientId, 'Turning TV off... 📺');
                    });
                }
            },
        },
    },
    {
        regex: /.*\s?(?:volume|vol)(?:\s.+)?/i,
        handler: {
            handleMessage: (text, recipientId) => {
                if (text.match(/^\s*(volume|vol)\s*$/i)) {
                    api.sendQuickReplyMessage(recipientId, 'What should I turn the volume to?', [
                        {
                            title: '10',
                            payload: 'volume 10',
                        },
                        {
                            title: '20',
                            payload: 'volume 20',
                        },
                        {
                            title: '25',
                            payload: 'volume 25',
                        },
                        {
                            title: '30',
                            payload: 'volume 30',
                        },
                        {
                            title: '35',
                            payload: 'volume 35',
                        },
                        {
                            title: '40',
                            payload: 'volume 40',
                        },
                        {
                            title: '45',
                            payload: 'volume 45',
                        },
                        {
                            title: '50',
                            payload: 'volume 50',
                        },
                        {
                            title: '60',
                            payload: 'volume 60',
                        },
                        {
                            title: '75',
                            payload: 'volume 75',
                        },
                        {
                            title: '90',
                            payload: 'volume 90',
                        },
                    ]);
                } else {
                    const newVol = /.*\s?(?:volume|vol)(?:\s.+)?\s(\d{1,})(?:\s.+)?/i.exec(text)[1];
                    sendMqtt('events/kodi/volume', newVol).then(() => {
                        sendOk(recipientId, `${newVol} it is, mate! 💂`);
                    });
                }
            },
        },
    },
    {
        regex: /.*\s?say(\s.+)?/i,
        handler: {
            handleMessage: (text, recipientId) => {
                sendMqtt('events/home/speak', text.replace(/^\s*say\s+/i, '')).then(() => {
                    sendOk(recipientId);
                });
            },
        },
    },
    {
        regex: /(.+\s)?(coming|I'm home|home now)(\s.+)?/i,
        handler: {
            handleMessage: (text, recipientId) => {
                sendMqtt('events/home/coming').then(() => {
                    sendOk(recipientId, 'Welcome home! 🏠');
                });
            },
        },
    },
    {
        regex: /(.+\s)?(leaving|going out|see you)(\s.+)?/i,
        handler: {
            handleMessage: (text, recipientId) => {
                sendMqtt('events/home/leaving').then(() => {
                    sendOk(recipientId, 'See you later! 🚶');
                });
            },
        },
    },
    {
        regex: /(.+\s)?(morning)(\s.+)?/i,
        handler: {
            handleMessage: (text, recipientId) => {
                sendMqtt('events/wake').then(() => {
                    sendOk(recipientId, 'Good morning, sunshine! 🌅');
                });
            },
        },
    },
    {
        regex: /(.+\s)?(night|sleep)(\s.+)?/i,
        handler: {
            handleMessage: (text, recipientId) => {
                sendMqtt('events/sleep').then(() => {
                    sendOk(recipientId, 'Good night! 🛌');
                });
            },
        },
    },
    {
        regex: /(.+\s)?(addon)(\s.+)?/i,
        handler: {
            handleMessage: (text, recipientId) => {
                sendMqtt('events/watch/addon').then(() => {
                    sendOk(recipientId);
                });
            },
        },
    },
    {
        regex: /(.+\s)?(reset kodi)(\s.+)?/i,
        handler: {
            handleMessage: (text, recipientId) => {
                sendMqtt('events/kodi/done').then(() => {
                    sendOk(recipientId);
                });
            },
        },
    },
    {
        regex: /(.+\s)?(talk|text|write).+me(\s.+)?/i,
        handler: {
            handleMessage: (text, recipientId) => {
                api.sendTextMessage(recipientId, 'I shall write you a few messages after this one.');
                setTimeout(() => {
                    api.sendTextMessage(recipientId, 'This is the first of said messages!');
                }, 2000);
                setTimeout(() => {
                    api.sendTextMessage(recipientId, 'This is the second of those messages. 2⃣');
                }, 5000);
                setTimeout(() => {
                    api.sendTextMessage(recipientId, 'And here is the third message. It is a quite long one with a few lines of text.\nIt also includes a line break, some commas, and \n another line break right here.');
                }, 10000);
                setTimeout(() => {
                    api.sendTextMessage(recipientId, 'And here is the final message. I\'m done talking now. See you later, buddy!');
                }, 12000);
                setTimeout(() => {
                    sendDefaultMessage(recipientId);
                }, 15000);
            },
        },
    },
    {
        regex: /.+/i,
        handler: {
            handleMessage: (text, recipientId) => {
                sendOk(recipientId, 'Not sure what you mean there, buddy 🤔');
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
    if (event.message.quick_reply && event.message.quick_reply.payload) {
        text = event.message.quick_reply.payload;
    } else {
        text = event.message.text;
    }
    if (text) {
        api.sendTypingOn(event.sender.id);
        getMessageHandler(text).handleMessage(text, event.sender.id);
    }
}
