var Botkit = require('botkit')
var WitBot = require('witbot')
var SlideSearch = require('./slidesearch')

var token = process.env.SLACK_TOKEN
var witToken = process.env.WIT_TOKEN

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

controller.hears('.*', ['direct_message', 'direct_mention'], function (bot, message) {
  bot.reply(message, 'Sorry <@' + message.user + '>, I don\'t understand. \n')
})
