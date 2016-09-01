var mongo = require('mongojs');
var db = mongo('pollster', ['polls']);

var polls = [
  {
    user: 'pollster',
    question: 'Would you rather eat a 1 cup of cold butter or catsup?',
    options: [
      'butter',
      'catsup'
    ],
    inserted: new Date(),
    complete: [],
    channel: 'C12P30G57',
    answers: {0: 0,
              1: 0}
  },{
    user: 'pollster',
    question: 'Would you rather eat 1 cup of hot butter or catsup?',
    options: [
      'butter',
      'catsup'
    ],
    inserted: new Date(),
    complete: [],
    channel: 'C12P30G57',
    answers: {0: 0,
              1: 0}
  },{
    user: 'pollster',
    question: 'How far could you throw a goat?',
    options: [
      '10ft',
      '20ft',
      '30ft',
      '100ft'
    ],
    inserted: new Date(),
    complete: [],
    channel: 'C12P30G57',
    answers: {0: 0,
              1: 0,
              2: 0,
              3: 0}
  },{
    user: 'pollster',
    question: 'Chopped, Master Chef or Iron Chef',
    options: [
      'Chopped',
      'Master Chef',
      'Iron Chef'
    ],
    inserted: new Date(),
    complete: [],
    channel: 'C12P30G57',
    answers: {0: 0,
              1: 0,
              2: 0}
  },{
    user: 'pollster',
    question: 'Tacos or Pizza?',
    options: [
      'Tacos',
      'Pizza'
    ],
    inserted: new Date(),
    complete: [],
    channel: 'C12P30G57',
    answers: {0: 0,
              1: 0}
  },{
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
    complete: [],
    channel: 'C12P30G57',
    answers: {0: 0,
              1: 0,
              2: 0,
              3: 0,
              4: 0,
              5: 0}
  },{
    user: 'pollster',
    question: 'NASCAR or Indy',
    options: [
      'NASCAR',
      'Indy',
      'Fuck circles!'
    ],
    inserted: new Date(),
    complete: [],
    channel: 'C12P30G57',
    answers: {0: 0,
              1: 0,
              2: 0}
  },{
    user: 'pollster',
    question: 'Brains?',
    options: [
      'yes',
      'braaaaiiiinnnns'
    ],
    inserted: new Date(),
    complete: [],
    channel: 'C12P30G57',
    answers: {0: 0,
              1: 0}
  },{
    user: 'pollster',
    question: 'Am I a cool bot?',
    options: [
      '1',
      '0'
    ],
    inserted: new Date(),
    complete: [],
    channel: 'C12P30G57',
    answers: {0: 0,
              1: 0}
  },
  {
    user: 'pollster',
    question: 'Strong or Weak types?',
    options: [
      'Strong',
      'Weak'
    ],
    inserted: new Date(),
    complete: [],
    channel: 'C12P30G57',
    answers: {0: 0,
              1: 0}
  }
]

db.polls.drop((one, two) => {
  if (one) {
    console.log('one ' + one)
  }
  if (two) {
    console.log('two ' + two)
  }
  console.log(one || two || 'not one or two...');
  db.polls.insert(polls, (err, docs) => {
    console.log(err || docs || 'no error or docs')
    process.exit();
  })
});
