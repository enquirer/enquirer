'use strict';

var Enquirer = require('..');
var enquirer = new Enquirer();

enquirer.ask({
    name: 'flavor',
    message: 'Favorite flavor?',
    default: 'chocolate',
    validate: function(input) {
      if (this.status === 'submitted' && input.trim() !== 'chocolate') {
        return 'Ohhhh, so close. The correct answer is "chocolate... chocolate". Try again.';
      }
      return true;
    }
  })
  .then(function(answers) {
    console.log('Whaaa?! that\'s so craaazaaay. I love,', answers.flavor, 'tooo!');
  });
