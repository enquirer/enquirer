'use strict';

const colors = require('ansi-colors');
const Prompt = require('../../lib/prompts/input');
const prompt = new Prompt({
  initial: 'jonschlinkert',
  languages: {
    en: {
      message: `What is your username?`
    },
    fr: {
      message: `Quel est votre nom d'utilisateur?`
    },
    de: {
      message: `Was ist Ihr Benutzername?`
    }
  }
});

prompt.run()
  .then(answer => console.log('ANSWER', answer))
  .catch(console.log)
