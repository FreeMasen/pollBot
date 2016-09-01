function dummyBot(test) {
  this.name == pollster
  this.test = test
}

dummyBot.prototype.startConversation = function(msg, callback) {
  console.log('start dummyCon')
  callback(undefined, new dummyCon(this.test))
}

dummybot.prototype.startPrivateConversation = function(msg, callback) {
  console.log('start private dummyCon')
  callback(undefined, new dummyCon(this.test))
}

function dummyCon(test) {
  this.name = 'dummyCon'
  this.test = test
}

dummyCon.prototype.ask = function(msg, callback) {
  console.log('dummyCon ask ' + msg);
  callback(undefined, 'dummyResponse')
}

dummyCon.prototype.say = function(msg) {
  console.log('dummyCon say ' + msg)
}
