var mongo = require('mongojs');
var db = mongo('pollster', ['users']);

  var users = {};


function getUsers (bot, callback) {
  //console.log('sending request');
  var options = {
    token: 'xoxb-72634628659-oWWicI9A8ktNwc2nr7QccsNp',
  }
  bot.api.users.list(options, (err, users) => {
    //console.log('got ' + users.members.length + ' users');
    if (!err) {
      saveUsers(users.members, callback);
    }
  })
}

function saveUsers (users, callback) {
  if (users && users.length > 0) {
    var filtered = users.filter(function(x) {
      return x.deleted == false && x.is_bot == false && x.name != 'slackbot'
    })
    var mapped = filtered.map(function(x) {
      var user = {
        id: x.id,
        team_id: x.team_id,
        name: x.name,
        real_name: x.real_name
      }
      users[user.name] = user
      return user
    })
    db.users.insert(mapped, function(err, docs) {
      if (!err) {
        callback(true);
      } else {
        callback(false)
      }
    })
  }
}

function lookupUser(id, callback) {
  console.log(id)
  if (users[id]) {
    callback(users[id].name);
  } else {
    db.users.find({id: id}, function(err, docs) {
      callback(docs[0].name);
    })
  }
}

module.exports = {
                  users: users,
                  lookupUser: lookupUser,
                  saveUsers: saveUsers,
                  getUsers: getUsers}
