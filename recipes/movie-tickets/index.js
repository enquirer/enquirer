'use strict';

const Wizard = require('../../wizard');
const data = require('./movies.json');

const prompt = new Wizard({
  name: 'movies',
  steps: [
    {
      name: 'search',
      type: 'input',
      placeholder: '45241',
      message: 'Enter your zip code to find theaters',
      validate(val) {
        return val;
      },
      submit() {
        let val = this.typed;
        this.typed = '';
        return val;
      }
    },
    {
      name: 'theaters',
      type: 'choices',
      message: 'Select a theater',
      init() {
        return [...data.theaters];
      },
      submit() {
        let val = this.selected.value;
        this.choices = [];
        return val;
      }
    },
    {
      name: 'movies',
      type: 'choices',
      message: 'Select a movie',
      init() {
        return [...data.movies];
      },
      submit() {
        let val = this.selected.value;
        this.choices = [];
        return val;
      }
    },
    {
      name: 'showtimes',
      type: 'choices',
      message: 'Select a showtime',
      init() {
        return [...data.showtimes];
      },
      submit() {
        let val = this.selected.value;
        this.choices = [];
        return val;
      }
    },
    {
      name: 'tickets',
      type: 'input',
      placeholder: '1',
      message: 'Enter the number of tickets to purchase',
      validate(val) {
        return val;
      },
      submit() {
        let val = this.typed;
        this.typed = '';
        return val;
      }
    }
  ]
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
