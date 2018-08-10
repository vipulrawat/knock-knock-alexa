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
        this.ask(speech, `Say yes to start.`);
    },

    'AMAZON.YesIntent': function () {
        selected = jokes[Math.floor((Math.random() * jokes.length))];
        let speech = `<speak><say-as interpret-as="interjection">knock knock</say-as></speak>`;
        let reprompt = `<speak><say-as interpret-as="interjection">knock knock</say-as></speak>`;
        this.followUpState('knocked')
            .ask(speech, reprompt);
    },
    'AMAZON.NoIntent': function () {
        this.tell('Ok! It seems you are not interested in playing.<speak><say-as interpret-as="interjection">zap</say-as></speak>');
    },
    'knocked': {

        'whosThere': function () {                         //"who is there"
            let speech = selected.item;
            this.ask(speech);
        },
        'itemIntent': function () {                      //"a broken pencil who?"
            let speech = selected.conclusion;
            this.ask(speech + `<speak><break time="2s"/><audio src='https://s3.amazonaws.com/ask-soundlibrary/human/amzn_sfx_laughter_giggle_02.mp3'/>
            Do you want more?</speak>`);
        },
        'funnyIntent':function(){
            let speech=`<speak><audio src='https://s3.amazonaws.com/ask-soundlibrary/human/amzn_sfx_laughter_giggle_01.mp3'/>
            You got me! You are smart kid. Bye</speak>`;
            this.tell(speech);
        },
        'AMAZON.YesIntent': function () {
            this.toStatelessIntent('AMAZON.YesIntent');
        },
        'AMAZON.NoIntent': function () {
            this.tell(`<speak> <say-as interpret-as="interjection">hmm</say-as> See you later. Say open <say-as interpret-as="interjection">knock knock</say-as> for more.</speak>`);
        }
        ,
        'Unhandled': function () {
            this.tell('<speak><say-as interpret-as="interjection">na-na</say-as> You brroke the rules. Start again.</speak>');
        }
    },
    'Unhandled': function () {
        this.tell('<speak><say-as interpret-as="interjection">uh oh</say-as> You did it wrong.</speak>');
    }
});

module.exports.app = app;
