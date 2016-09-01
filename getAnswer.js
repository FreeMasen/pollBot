var Table = require('./table.js');
var users = require('./users.js');
var mongo = require('mongojs');
var db = mongo('pollster', ['polls']);

function ask(poll, conv) {
  //console.log('started ask')
  var t = new Table(poll)
  conv.say(t.asString())
  conv.next();
  conv.ask('Which option do you choose?', (msg, conv) => {
    if (isNaN(msg.text)) {
      notANumber(conv, poll);
    } else {
      isNumber(conv, poll, msg.text);
    }
  })
  conv.next()
}

function notANumber(conv, poll) {
  //console.log('start nan')
  conv.ask('I need a number between 0 and ' + poll.options.length - 1, (msg, conv) =>{
    if (msg.text == 'quit') {
      conv.next();
    } else if (isNaN(msg.text)) {
      notANumber(conv)
    } else {
      isNumber(conv, poll), msg.text
    }
    conv.next();
  });
  conv.next()
}

function isNumber(conv, poll, choice) {
  //console.log('start isN')
  //console.log(poll)
  conv.ask('your choice is ' + poll.options[choice] + '?', (msg, conv) => {
    if (msg.text == 'y' ||
        msg.text == 'yes' ||
        msg.text == 'Y' ||
        msg.text == 'YES'
      ) {
      conv.say('Ok, saving your response')
      //console.log('looking up user')
      users.lookupUser(msg.user, (user) => {
        //console.log('found ' + user);
        //console.log('updating')

        update = '{"$push": {"complete":"' + user + '"},' +
                  '"$inc": { "answers.'+ choice + '": 1}}'
        ////console.log(updateText);
        //update = JSON.parse(updateText);
        //console.log('update')
        //console.log(update)
        //console.log(poll)
        db.polls.findAndModify({
          query: {_id: poll._id},
          update: JSON.parse(update),
          upsert: true
        }, (err, doc) => {
          //console.log('mongo callback')
          //console.log('err');
          //console.log(err);
          //console.log('doc');
          //console.log(doc);
          if (!err) {
            conv.say('saved your response');
            conv.next();
          } else {
            conv.say('sorry, I was not able to save your response, talk to robot about that')
            conv.next();
          }
        }
        )
      });

    }
  });
  conv.next();
}

module.exports = ask
