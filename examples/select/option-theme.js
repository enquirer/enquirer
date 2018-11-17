'use strict';

const colors = require('ansi-colors');
const { Select } = require('enquirer');

/**
 * This example is unnecessarily complex, just to show how
 * flexible Enquirer is in regards to customizing symbols
 * and styles.
 */

const emoji = { pending: '🎃', cancelled: '⚰️ ', submitted: '💀' };
const halloween = {
  styles: {
    primary: colors.blue,
    muted: colors.yellow
  },
  symbols: {
    radio: {
      on: state => ['🍬', '🍎', '👄', '🖕'][state.index],
      off: '  '
    }
  },
  prefix: state => emoji[state.status],
  pointer(state, choice, i) {
    let status = state.index === i ? 'on' : 'off';
    let symbol = this.symbols.radio[status];
    let fallback = '🗡️ ';
    if (typeof symbol === 'function') {
      return symbol(...arguments) || fallback;
    }
    return symbol || fallback;
  }
};

const prompt = new Select({
  name: 'halloween',
  message: 'Trick or treat! Take your pick',
  theme: halloween,
  choices: [
    { name: 'candy', value: 'Sweet!' },
    { name: 'apple', value: 'Hard... core?' },
    { name: 'toothpaste', value: 'Orange juice?' },
    { name: 'insult', value: 'You stink!' },
    { name: 'razor blade', value: 'Ouch!' }
  ]
});

prompt.run()
  .then(key => {
    let choice = prompt.choices.find(ch => ch.name === key);
    console.log('answer:', { [key]: choice.value });
  })
  .catch(console.error);
