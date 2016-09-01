
var helpText = 'What do you want to know more about?\n'+
              'Asking a new question?(reply "ask")\n'+
              'Answering questions?(reply "answer")\n'+
              'Seeing the results of a poll?(reply "polls")'

var askHelp = 'If you want to pose a question simply send me a direct mention with'+
              'your question.\n' +
              'I will then need to ask you for your multiple choice options.\n'+
              'Once I have all that I will store your question for future reference'

var answerHelp = 'If you want to answer a question, just send me a direct mention'+
              'with the word "answer" and I will pick a question from my memory'+
              'that you have not answered'

var viewOne = 'If you want to see the results of a poll send me a direction mention'+
                'that starts with the word "poll" and includes information about the question you want to see the results for.\n'+
                'if you include the word "about" I will try and find the phrase that follows+'
                'it in my memory'
var viewTwo = 'if you include the word "from" with a direct mention after it, I will'+
                'search for questions from that user'+
                'If you include the word last, I will only send the last question, '+
                'otherwise I will ask some more clairifying questions\n'
var viewThree = 'Example: @pollster poll last question from @Robot about tigers\n'+
                'would get you the last question that @Robot asked about tigers'

function getHelp(bot, msg) {
  bot.startConversation(msg, (err, conv) => {
    startHelp(msg, conv)
  })
}

function startHelp(msg, conv) {
  conv.ask(helpText, [
    {
      pattern: 'ask',
      callback: function(msg, conv) {
        conv.say(askHelp);
        conv.next()
      }
    },
    {
      pattern: 'answer',
      callback: function(msg, conv) {
        conv.say(answerHelp);
        conv.next();
      }
    },
    {
      pattern: 'polls',
      callback: function(msg, conv) {
        conv.say(viewOne);
        conv.next();
        conv.say(viewTwo);
        conv.next();
        conv.say(viewThree);
        conv.next()
      }
    },
    {
      default: true,
      callback: function(msg, conv) {
        conv.say('sorry I do not know what that means');
        startHelp(msg, conv);
        conv.next()
      }
    }
  ])
}

module.exports = getHelp
