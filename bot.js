var Botkit = require('botkit');
var mongo = require('mongojs');
var db = mongo('pollster', ['polls', 'users']);
var api = mongo('api', ['keys']);
var users = require('./users.js')
var restart = require('./restart.js');
var constructQuestion = require('./constructQuestion.js');
var polls = require('./polls.js')
var getPollResults = require('./polls.js')
var help = require('./help.js')

var controller = Botkit.slackbot();
var options = {
  token: ''
}

var poller
controller.on('error', function(e) {
  //console.log('error')
  //console.log(e);
})

controller.on(['direct_mention', 'direct_message'], function(bot, msg) {
  if (msg.text.substring(0,4) == 'help'){
    help(bot, msg);
  } else if (msg.text.substring(0,6) == 'answer') {
    polls.toAnswer(bot, msg)
  } else if (msg.text.substring(0,4) == 'poll') {
    polls.results(bot, msg)
  } else {
    constructQuestion(bot, msg)
  }
});


function configure() {
  //console.log('checking if we have users')
  db.polls.createIndex({question: 'text'});
  api.keys.find({name: 'pollBot'}, (err, docs) => {
    if (err) {
      console.log('error getting api key, shutting down');
      console.log(err);
      process.exit();
    }
    var keys = docs.keys
    options.token = docs[0].keys[0].slack;
    poller = controller.spawn(options);
  db.users.find({}, (err, docs) => {
    if (!err) {
      if (!docs.length) {
        //console.log('no users found, requesting new users');
        users.getUsers(poller, function(success) {
          if (success == true) {
            poller.startRTM((err, bot, payload) => {
              if (err) {
                throw err
              }
            })
          } else {
            restart(function(response) {
              if (response == true) {
                configure();
              } else {
                process.exit();
              }
            })
          }
        });
      } else {
        //console.log(docs.length + ' users found, starting rtm')
        poller.startRTM((err, bot, payload) => {
          if (err) {
            throw err;
          }
        })
      }
    } else {
      //console.log('error requesting users');
      //console.log(err);
    }
  })
})
}

configure();
