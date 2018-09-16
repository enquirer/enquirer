'use strict';

const assert = require('assert');
const Prompt = require('../..');
const { dim, blue, green, red } = require('ansi-colors');
const { movies, showtimes, theaters } = require('./movies');
const { prompts, utils } = Prompt;
const { ansi, symbols } = utils;

const answers = {};
const completed = new Set();
const steps = new Set(['zipcode', 'theater', 'movie', 'showtime', 'tickets', 'payment']);
const check = name => {
  if (completed.has(name)) return blue(symbols.check + ' ' + name);
  return dim.gray(symbols.check) + ' ' + dim(name);
};

const dollars = val => {
  let amount = Intl.NumberFormat(void 0, { style: 'currency', currency: 'USD' });
  return amount.format(val).replace(/\.0+$/, '');
};

const price = () => showtimes.find(s => answers.showtime === s.value).price;
const total = qty => dollars(qty * price());

const header = () => {
  return [...steps].map(check).join(` ${dim(symbols.rightAngleSmall)} `);
};

const questions = [
  {
    type: 'text',
    name: 'zipcode',
    initial: '45241',
    message: 'Enter your zip code to find theaters',
    header,
    onSubmit() {
      completed.add(this.name);
      this.cursorHide();
    }
  },
  {
    type: 'select',
    name: 'theater',
    message: 'Select a theater',
    header,
    choices: async() => await [...theaters],
    onSubmit() {
      completed.add(this.name);
    }
  },
  {
    type: 'select',
    name: 'movie',
    message: 'Select a movie',
    header,
    choices: async() => await [...movies],
    onSubmit() {
      completed.add(this.name);
    }
  },
  {
    type: 'select',
    name: 'showtime',
    message: 'Select a showtime',
    header,
    choices: async() => {
      let movie = movies.find(m => answers.movie === m.value);
      return await [...movie.showtimes];
    },
    onSubmit() {
      completed.add(this.name);
    }
  },
  {
    type: 'number',
    name: 'tickets',
    float: true,
    header,
    message() {
      return `Enter the number of tickets to purchase (USD $${price()}/ticket)`;
    },
    hint() {
      let amount = green(total(Number(this.value || this.typed)));
      return !this.answered ? ` (${amount})` : '';
    },
    format(qty) {
      return total(qty);
    },
    onSubmit() {
      completed.add(this.name);
    }
  },
  {
    type: 'password',
    name: 'payment',
    header,
    message() {
      return 'Enter your pre-registered passphrase to make payment';
    },
    validate(value) {
      if (typeof value !== 'string' || value.length < 6) {
        let restore = this.cursorHide();
        this.render(red('Passphrase must be 6 or more characters.'));
        restore();
        return false;
      }
      return true;
    },
    onSubmit() {
      completed.add(this.name);
    }
  }
];

const enquirer = async(questions, options) => {
  questions = [].concat(questions);

  for (let key of Object.keys(prompts)) {
    prompts[key.toLowerCase()] = prompts[key];
  }

  const ask = async (question, i) => {
    let opts = { ...options, ...question };
    let type = opts.type.toLowerCase();
    assert(prompts[type], `type "${type}" is not registered`);

    let Prompt = prompts[type];
    let prompt = new Prompt(opts);

    prompt.forward = async() => {
      if (i === question.length - 1) return prompt.alert();
      await ask(questions[++i]);
    };

    prompt.back = async() => {
      if (i === 0) return prompt.alert();
      await ask(questions[--i]);
    };

    prompt.on('run', () => {
      if (!completed.size) return;
      prompt.write(ansi.cursor.up(2));
      prompt.write(ansi.erase.line);
    });

    answers[prompt.name] = await prompt.run();
  };

  for (let i = 0; i < questions.length; i++) {
    await ask(questions[i], i);
  }
};

enquirer(questions).catch(console.log);
