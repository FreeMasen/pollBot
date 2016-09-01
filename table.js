var h = '⋯'
var v = '┆'
var outer = '⎪'
var over = '￣'
var under = '＿'

function toShortString(date) {
  var string = date.toString();
  return string.substring(4, 10) + ', ' + string.substring(11,16)
}

function Table(poll) {
  ////console.log('creating table from')
  ////console.log(poll);
  this.heading = '``` ';
  this.heading += poll.question + '\n'
  this.heading += ' asked on ' + toShortString(poll.inserted) + '\n'
  this.heading += ' '+makeLine('∷', 51)  +'\n';
  this.heading += outer + ' Option '
  this.heading += outer + ' ' + pad('Answer', 25) + ' '
  this.heading += outer+' Times Chosen ' + outer + '\n'
  this.heading += ' ' + makeLine('∷', 51)
  this.totalResponses = 0
  this.getOptions(poll)
  this.countAnswers(poll.answers)
  this.constructRows(poll)
}

Table.prototype.asString = function() {
  var self = this
  var rowCount = self.rows.length
  ////console.log('rows length: ' + rowCount)

  var hDiv = ' ' + makeLine('∘', 51) + '\n';
  var s = self.heading + '\n'

  var i = 0
  while (i<rowCount) {
    ////console.log('loop ' + i);
    s += self.rows[i].asString();
    s += hDiv;
    i++
  }
  s += outer + pad(' total', 36) + v
  s +=  '      ' + pad(this.totalResponses.toString(), 8) + outer + '\n'
  s += hDiv
  s += '```'
  return s
}

Table.prototype.getOptions = function(poll) {
  // ////console.log('poll.options ' + poll.options)
  this.answers = {}
  for (i=0;i<poll.options.length;i++) {
    ////console.log('loop ' + i + ': ' + poll.options[i])
    this.answers[i] = 0
  }
}

Table.prototype.constructRows = function(polls) {

  this.rows = []
  for (i=0;i<polls.options.length;i++) {
    //console.log('constructing row from poll answer');
    //console.log(this.answers[i]);
    var option = i;
    var answer = polls.options[i];
    this.rows.push(new Row(option, answer, this.answers[i]));
  }
}

Table.prototype.countAnswers = function(answers) {
  for (var k in answers) {
    //console.log(k + ': ' + answers[k]);
    this.answers[k] = answers[k];
    this.totalResponses += answers[k];
    //console.log('total responses ' + this.totalResponses)
  }
}

function Row(option, answer, count) {
  // //console.log('entered Row const')
  this.option = option;
  this.wrap(answer);
  this.count = count;
}

Row.prototype.wrap = function(answer) {
  ////console.log('wrapping');

  if (answer.length < 25) {
    this.answer = [answer]
    this.height = 1
    return
  }
  var wrapped = [];
  this.height = 0
  var start = 0
  var more = true;
  while (more) {
    ////console.log('loop: ' + this.height)
    this.height++;
    var end = start + 25;
    ////console.log('start: ' + start)
    ////console.log('end: ' + end);
    var line
    if (end >= answer.length) {
      more = false
      line = answer.substring(start);
    } else {
      line = answer.substring(start, end);
    }
    ////console.log(line)
    var index = line.lastIndexOf(' ');
    ////console.log('index: ' + index);

    if (index == -1) {
      index = end;
    }
    var smallerLine = line.substring(0,index);
    ////console.log(smallerLine);
    wrapped.push(smallerLine)
    start = index + 25

  }
  this.answer = wrapped;
}

function pad(string, width) {

  while (string.length < width){
    //console.log('"' + string+'"')
    string += ' '
  }
  return string
}

Row.prototype.asString = function() {
  // ////console.log('asString');
  var s = ''
  for (i=0;i<this.height;i++) {
    // ////console.log(i);
    if (i == 0) {
      s += outer + '   ' + this.option + '    ' + v;
    } else {
      s += outer + '       ' + v
    }
    s += ' ' + pad(this.answer[i], 25)
    if (i == 0) {
      s += ' ' + v + '      ' + pad(this.count.toString(), 8) + outer + '\n'
    } else {
      // TODO: add empty space
      ' ' + v + '      ' + pad(' ', 8) + outer + '\n'
    }
  }
  return s
}

function makeLine(ch, length) {
  var line = ''
  while (line.length < length) {
    line += ch;
  }
  return line;
}

var p = {
  user: 'pollster',
  question: 'If you could go back in time, which would you rather do?',
  options: [
    'Kill Hitler',
    'See Dylan go electric',
    'Defend the Alamo',
    'Wrestle Teddy Rosevelt',
    'Meditate with Sidhartha',
    'Visit the Bauhaus'
  ],
  inserted: new Date(),
  complete: ['robot'],
  channel: 'C12P30G57',
  answers: {
    0:1,
    1:12,
    2:0,
    3:6,
    4:2,
    5:4
  }
}
// var t = new Table(p);
// //console.log(t.asString())

module.exports = Table
