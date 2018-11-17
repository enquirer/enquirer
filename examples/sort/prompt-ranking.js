'use strict';

const { Sort } = require('enquirer');

const prompt = new Sort({
  name: 'career',
  message: 'Please rank the following in order of importance',
  numbered: true,
  choices: ['Recognition', 'Opportunity', 'Pay', 'Benefits', 'Co-workers']
});

prompt.run()
  .catch(console.error);
