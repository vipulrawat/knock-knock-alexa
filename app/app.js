'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const { App } = require('jovo-framework');

const config = {
    logging: false,
};

const app = new App(config);


var jokes = [
    { item: 'Cash',conclusion: 'No thanks, I prefer peanuts.'},
    { item: 'Owls',conclusion: 'Yes, they do.'},
    { item: 'kanga', conclusion: 'Actually, it\'s kangaroo.' },
    { item: 'Deja', conclusion: 'Knock!Knock.' },
    { item: 'An extraterrestrial', conclusion: 'Wait-how many extrateresstrial do you know?' },
    { item: 'Spell', conclusion: 'W-H-O' },
    { item: 'Hatch', conclusion: 'God bless you.' },
    { item: 'Doris', conclusion: 'Doris locked, that\'s why I had to knock.' },
    { item: 'Nobel', conclusion: 'No bell so I\'ll knock.' },
    { item: 'Bless', conclusion: 'I did\'s sneeze!' },
    { item: 'Icecream', conclusion: 'I scream if you don\'t let me in.' }
];

// =================================================================================
// App Logic
// =================================================================================

var selected='';
console.log('Outside:selected-'+selected);
app.setHandler({
    'LAUNCH': function () {
        selected = jokes[Math.floor((Math.random() * jokes.length))];
        console.log('Inside launch:selected-'+selected);

        let speech = `Welcome to the game of knock knock. Here are the rules: I'll start by saying knock knock and then you've to say "who's there". Do you want to continue?`;
        this.ask(speech, `Say yes to start.`);
    },

    'AMAZON.YesIntent': function () {
        let speech = `Knock!Knock!`;
        let reprompt = `Knock! Knock!`;
        this.followUpState('knocked')
            .ask(speech, reprompt);
    },
    'AMAZON.NoIntent': function () {
        this.tell('You said No. Quitting the game.');
    },
    'knocked': {

        'whosThere': function () {                         //"who is there"
            console.log('Inside whosThere:selected-'+selected);

            let speech = selected.item;
            this.ask(speech);
        },
        'itemIntent': function () {                      //"a broken pencil who?"
            let speech = selected.conclusion;
            this.ask(speech + ' Hahahaha. Do you want more?');
        },

        'AMAZON.YesIntent': function () {
            this.toStatelessIntent('LAUNCH');
        },
        'AMAZON.NoIntent': function () {
            this.tell('Ok See you later.Say open knock knock for more.');
        }
        ,
        'Unhandled': function () {
            this.tell('Sorry, inside knocked, the intent not found');
        }
    },
    'Unhandled': function () {
        this.tell('Global unhandled state');
    }
});

module.exports.app = app;
