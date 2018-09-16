'use strict';

const assert = require('assert');
const Prompt = require('../../..');
const { dim, blue, cyan, green, red, bold } = require('ansi-colors');

const questions = [
  {
    type: 'text',
    name: 'zipcode',
    initial: '45241',
    message: 'Enter your zip code to find theaters',
  },
  {
    type: 'text',
    name: 'payment',
    message: 'Enter your pre-registered passphrase to make payment'
  }
];

questions.forEach(q => console.log(cyan('? ') + bold(q.message)));
