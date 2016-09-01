var prompt = require('prompt');

var schema = {
  properties: {
    response: {
      description: 'retry? (y/n)',
      pattern: '/^y|n|Y|N',
      default: 'no'
    }
  }
}

function restart(callback) {
  prompt.start();
  prompt.get(schema, (err, result) => {
    if (err) throw err;
    if (result.response.toLowerCase() == 'yes' ||
            result.response.toLowerCase() == 'y') {
              callback(true)
    } else if (result.response.toLowerCase() == 'n' ||
                result.responst.toLowerCase() == 'no') {
      callback(false)
    }
  })
}

module.exports = restart
