var traceback = require('traceback');

function Logger() {

}

Logger.prototype.log = function(text) {
  var stack = traceback();
  for (i=0;i<stack.length;i++) {
    console.log(stack[i].name)
  }
}

module.exports = Logger
