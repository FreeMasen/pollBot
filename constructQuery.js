function constructQuery(words) {
  console.log('costructed query started')
  q = parseWords(words);
  q.last = determineLast(words);
  return q
}

function determineLast(words) {
  console.log('determineLast')

  var index = words.indexOf('last')
  return (index > -1 && index < 3);
}

function parseWords(words) {
  console.log('parseWords')

  var locations = findKeywords(words);
  console.log(locations);
  var q = {
    mongo: {}
  };

  for (i=0;i<locations.length;i++) {
    if (locations[i][0] == 'from') {
      var userName = words[locations[i][1]+1]
      q.mongo.user = removeAt(userName)
    }
    if (locations[i][0] == 'about'){
      q.mongo['$text'] = {}
      var start = locations[i][1] +1;
      var end = words.length
      if (i <locations.length - 1) {
        end = locations[i+1][1]-1
      }
      q.mongo['$text']['$search'] = words.slice(start, end).reduce(reduceStrings);
    }
  }
  return q
}

function reduceStrings(last, curr) {
  //console.log('reduceStrings')
return last + ' ' + curr
}

function findKeywords(words) {
  //console.log('find keywords started')
  var locs = [];
  var a = words.indexOf('about')
  var f = words.indexOf('from')
  if (a > -1) {
    locs.push(['about', a])
  }
  if (f > -1) {
    locs.push(['from', f])
  }
  locs.sort(function(a, b) {
    return a[1] - b[1]
  });
  //console.log(JSON.stringify(locs));
  return locs;
}

function removeAt(userName) {
  if (userName[0] == '@') {
    return userName.substring(1);
  }
}
module.exports = constructQuery
