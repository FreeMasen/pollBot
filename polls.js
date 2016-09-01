
var constructQuery = require('./constructQuery.js');
var mongo = require('mongojs');
var db = mongo('pollster', ['polls']);
var users = require('./users.js').lookupUser;
var Table = require('./table.js');
var getAnswer = require('./getAnswer.js')


function results(bot, msg) {
  console.log('get poll started')
  bot.startConversation(msg, (err, conv) => {
    console.log('started conversation')
    conv.say('let me see...')
    conv.next();
    var words = msg.text.split(' ');
    var query = constructQuery(msg.text.split(' '));
    users(msg.user, (name) => {
      if (name) {
        q.user = name;
        lookupPolls(query, (docs) => {
          if (!docs) {
            conv.say('sorry, I could not find any polls')
            conv.next();
          } else {
            docs.sort(sortPolls)
            conv.say('Here is what I found');
            conv.next();
            var x = formatPolls(docs)
            conv.say(x);
            conv.next();
          }
        })
      }
    })
  })
}

function formatPolls(polls, name) {
  var loopNum = polls.length
  console.log('enter formatPolls with ' + polls.length + ' polls');
  var string = '';
  var i = 0
  while (i < loopNum) {
    console.log(i)
    var t = new Table(polls[i])
    console.log(t);
    string += t.asString() + '\n';
    i++
  }
  return string
}

function lookupPolls(query, callback) {
  console.log(query.mongo)
  db.polls.find(query.mongo, (err, docs) => {
      console.log(docs);
    if (!err) {
      callback(docs);
    } else {
      callback(false);
    }
  })
}

function sortPolls(a, b) {
  return a.inserted - b.inserted
}

function findUnanswered(polls, user) {
  return polls.filter((x) => {
    console.log(x);
    var i = 0;
    while (i<x.complete.length) {
      if (x.complete[i] == user){
        return false
        i++
      }
    }
    return true
  })
}

function toAnswer(bot, msg) {
  //console.log('start toAnswer')
  bot.startPrivateConversation(msg, (err, conv) => {
    conv.say('Let me find one you hav not answered');
    conv.next();
    console.log('startConvo')
    users(msg.user, (name) => {
      var q = {mongo: {}}
      lookupPolls(q, (polls) => {
        // console.log('lookup -> find')
        // console.log(polls)
        var filtered = findUnanswered(polls, name);
        if (filtered.length < 1) {
          conv.say('You have answered all my polls, maybe you should ask the group something');
          conv.next()
          return
        }
        //console.log('Sending poll');
        //console.log(filtered[0]);
        getAnswer(filtered[0], conv);
      })
    })
  })
}

module.exports = {
  results: results,
  toAnswer: toAnswer
}
