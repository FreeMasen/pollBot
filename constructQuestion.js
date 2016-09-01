var users = require('./users');
var mongo = require('mongojs');
var db = mongo('pollster', ['polls', 'users']);

var poller;
var poll = {
  user: '',
  question: '',
  options: [],
  inserted: '',
  complete: [],
  channel: ''
}
function constructQuestion(bot, msg) {
  poller = bot;
  poller.startPrivateConversation(msg, function(err, conversation) {
    confirmQuestion(msg, conversation);
  })
}

function confirmQuestion(msg, conv) {
  //console.log('confirming question')
  conv.ask('was your question, '+msg.text+' (y/n)', [
    {
      pattern: poller.utterances.yes,
      callback: function(response, con) {
        con.poll = poll
        con.poll.question = msg.text;
        createQuestion(response, con);
        conv.next()
      }
    },
    {
      pattern: poller.utterances.no,
      callback: function(response, con) {
        notQuestion(response, con);
        conv.next()
      }
    }
  ]);
}

function createQuestion(response, conv) {
  //console.log('creating question')
  conv.ask('Ok, I created your question, what is option 1?', function(response, conv) {
    addMultipleCoiceOption(response, conv)
    conv.next();
  });
}

function notQuestion(response, conv) {
  //console.log('not question')
  conv.ask('what is your question ("quit" to end)', [
    {
      pattern: 'quit',
      callback: function(response, con) {
        conv.say('ok, maybe some other time')
        conv.next();
      }
    },
    {
      default: true,
      callback: function(response, con){
        confirmQuestion(response, conv)
        conv.next();
      }
    }
  ])
}

function endQuestion(response, conv) {
  //console.log('conversation end')
  conv.say('ok, I did not create a question');
  conv.next();
}

function addMultipleCoiceOption(response, conv) {
  console.log('add multiple choice option')
  console.log(response);
  conv.poll.options.push(response.text);
  //console.log(poll.options)
  conv.ask('What is option '+(poll.options.length + 1)+'? ("QUIT" to end)', [
    {
      pattern: 'quit',
      callback: function(response, conv) {
        completeQueston(response, conv)
        conv.next();
      }
    },
    {
      default: true,
      callback: function(response, conv) {
        addMultipleCoiceOption(response, conv);
        conv.next();
      }
    }
  ])
}

function completeQueston(response, conv) {
  //console.log('completing');
  //console.log(response);
  var newPoll = conv.poll
  newPoll.inserted = new Date();
  newPoll.channel = response.channel;
  users.lookupUser(response.user, (name) => {
    if (name) {
      conv.poll.user = name;
      db.polls.save(conv.poll, (err, doc) => {
        if (err) {
          console.log(err)
          conv.say('sorry, the database is being weird, @robot should fix me.');
          conv.next();
          //completeQueston(response, conv);
        } else {
          conv.say('Question completed');
          conv.next();
          conv.next();
        }
      })
    } else {
      process.exit();
    }
  })

}


module.exports = constructQuestion
