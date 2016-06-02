var Botkit = require('botkit')
var WitBot = require('witbot')
//var SlideSearch = require('./slidesearch')

var token = process.env.SLACK_TOKEN
var witToken = process.env.WIT_TOKEN

var witbot = WitBot(witToken)

// WIT TOKEN 5TQ5OFRNLTHUK3CG6LFVJQ7SBJFC5QCT

// OCTOPOD API https://octopod.octo.com/api/v0/projects?per_page=2&api_key=c79f11a9dd1031b6803dfbd498d84715
// AskBob API ???
// SlideSearch API ???
// Needs Docs

var controller = Botkit.slackbot({
  // reconnect to Slack RTM when connection goes bad
  retry: Infinity,
  debug: false
})

// Assume single team mode if we have a SLACK_TOKEN
if (token) {
  console.log('Starting in single-team mode')
  controller.spawn({
    token: token
  }).startRTM(function (err, bot, payload) {
    if (err) {
      throw new Error(err)
    }

    console.log('Connected to Slack RTM')
  })
// Otherwise assume multi-team mode - setup beep boop resourcer connection
} else {
  console.log('Starting in Beep Boop multi-team mode')
  require('beepboop-botkit').start(controller, { debug: true })
}

controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "I'm here!")
})

// wire up DMs and direct mentions to wit.ai
controller.hears('.*', 'direct_message,direct_mention', function (bot, message) {
  var wit = witbot.process(message.text, bot, message)

  wit.hears('hello', 0.53, function (bot, message, outcome) {
    bot.startConversation(message, function (_, convo) {
      convo.say('Hello!')
      convo.ask('How are you?', function (response, convo) {
        witbot.process(response.text)
            .hears('good', 0.5, function (outcome) {
              convo.say('I am so glad to hear it!')
              convo.next()
            })
            .hears('bad', 0.5, function (outcome) {
              convo.say('I\'m sorry, that is terrible')
              convo.next()
            })
            .otherwise(function (outcome) {
              convo.say('I\'m cofused')
              convo.repeat()
              convo.next()
            })
      })
    })
  })

  wit.otherwise(function (bot, message) {
    bot.reply(message, 'You are so intelligent, and I am so simple. I don\'t understnd')
  })
})
