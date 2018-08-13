'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const { App } = require('jovo-framework');
const jokes = require('./files');
const config = {
    logging: false,
};

const app = new App(config);

// =================================================================================
// App Logic
// =================================================================================

var selected = '';
app.setHandler({
    'LAUNCH': function () {
        let speech = `<speak><audio src='https://s3.amazonaws.com/ask-soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_intro_01.mp3'/>Welcome to the game of <say-as interpret-as="interjection">knock knock</say-as><p> Here are the rules:<break time="1s"/> 
        <audio src='https://s3.amazonaws.com/ask-soundlibrary/musical/amzn_sfx_drum_comedy_01.mp3'/>I\'ll start by saying knock knock and then you've to say "who's there".</p> <p>Do you want to play?</p></speak>`;
        this.alexaSkill().showSimpleCard('Hello kid', `Say "who's there?" after I say knock knock.`);
        this.ask(speech, `Say yes to start.`);
    },

    'AMAZON.YesIntent': function () {
        selected = jokes[Math.floor((Math.random() * jokes.length))];
        let speech = `<speak><say-as interpret-as="interjection">knock knock</say-as></speak>`;
        let reprompt = `<speak><say-as interpret-as="interjection">knock knock</say-as></speak>`;
        this.alexaSkill().showSimpleCard('Knock! Knock!', 'knock knock');
        this.followUpState('knocked')
            .ask(speech, reprompt);
    },
    'AMAZON.NoIntent': function () {
        this.alexaSkill().showSimpleCard('Knock! Knock!', 'Ok! Bye. Say open knock knock to play.');
        this.tell('Ok! It seems you are not interested in playing.<speak><say-as interpret-as="interjection">zap</say-as></speak>');
    },
    'AMAZON.HelpIntent': function () {
        let speech = `<speak>This will be a two way interactive session, based on knock-knock joke. I'll start first by saying knock-knock, you will ask "who's there?", I'll give the pun, you should respond with "pun who?" and then I'll conclude. Meanwhile you can say Stop or Cancel to exit. Simple! Do you want to start?</speak>`;
        let reprompt = `Say yes to start and no to end.`;
        this.ask(speech, reprompt);
    },
    'AMAZON.StopIntent': function () {
        let speech = `Ok! Bye! See you soon.`;
        this.tell(speech);
    },
    'AMAZON.CancelIntent': function () {
        this.toIntent('AMAZON.StopIntent');
    },
    'startByAsking':function(){
        let speech = `Ok! Let's start.`
        this.toStatelessIntent('AMAZON.YesIntent');
    },
    'knocked': {
        'whosThere': function () {                         //"who is there"
            let speech = selected.item;
            this.alexaSkill().showSimpleCard('Knock! Knock!', speech);
            this.ask(speech);
        },
        'itemIntent': function () {                      //"a broken pencil who?"
            let speech = `<speak><prosody rate="fast">${selected.conclusion}</prosody></speak>`;
            this.alexaSkill().showSimpleCard('Knock! Knock!', `${selected.conclusion} Say 'yes' if you want more`);
            this.ask(speech + `<speak><break time="2s"/><audio src='https://s3.amazonaws.com/ask-soundlibrary/human/amzn_sfx_laughter_giggle_02.mp3'/>
            Do you want more?</speak>`);
        },
        'funnyIntent': function () {
            let speech = `<speak><audio src='https://s3.amazonaws.com/ask-soundlibrary/human/amzn_sfx_laughter_giggle_01.mp3'/>
            You got me! You are smart kid. Bye</speak>`;
            this.alexaSkill().showSimpleCard('Knock! Knock!', 'You win!');
            this.tell(speech);
        },
        'AMAZON.YesIntent': function () {
            this.toStatelessIntent('AMAZON.YesIntent');
        },
        'AMAZON.NoIntent': function () {
            this.alexaSkill().showSimpleCard('Knock! Knock!', 'Bye!');
            this.tell(`<speak> <say-as interpret-as="interjection">hmm</say-as> See you later. Say open <say-as interpret-as="interjection">knock knock</say-as> for more.</speak>`);
            this.endSession();
        },
        'AMAZON.StopIntent': function () {
            let speech = `Ok! Bye! See you soon.`;
            this.tell(speech)
        },
        'AMAZON.CancelIntent': function () {
            this.toStatelessIntent('AMAZON.StopIntent');
        },
        'AMAZON.HelpIntent':function(){
            this.toStatelessIntent('AMAZON.HelpIntent');
        }
        ,
        'Unhandled': function () {
            this.alexaSkill().showSimpleCard('Knock! Knock!', 'Start again by saying \'open knock knock\'');
            this.tell('<speak><say-as interpret-as="interjection">na-na</say-as>. You broke the rules. Start again!</speak>');
            this.endSession();
        }
    },
    'Unhandled': function () {
        this.alexaSkill().showSimpleCard('Knock! Knock!', 'You did something wrong. Start again!');
        this.tell('<speak><say-as interpret-as="interjection">uh oh</say-as> You did it wrong.</speak>');
        this.endSession();
    }
});

module.exports.app = app;
