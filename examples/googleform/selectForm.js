'use strict';

const Enquirer = require('enquirer');
const GoogleFormPrompt = require('..');

const enquirer = new Enquirer();
enquirer.register('google', GoogleFormPrompt);

enquirer
  .prompt([
    {
      type: 'select',
      name: 'form',
      message: 'Which Form Would you like to fill out?',
      choices: [{
        value: '1FAIpQLSdniaX5nAjywbvnT9tQp1OTryh7148Lkl5LnvJV1mBOy1QXdA',
        message: 'Contact Form'
      }, {
        value: '1FAIpQLSfb_pdS57UJTS1qKaKfSLoDs9pudHLbNbkpp74kdpUYoEKz9Q',
        message: 'T-Shirt Form'
      }, {
        value: '1FAIpQLSd5YEpcRFJAE47OuvHyI6equ66DEspA9S2AZHCafhokHUbjWg',
        message: 'Event Form'
      }]
    },
    {
      name: 'Google Form',
      message: 'Please provide the information:',
      formId(state) {
        return state.answers.form;
      },
      type: 'google'
    }
  ])
  .then(res => console.log(res))
  .catch(err => console.log(err));
