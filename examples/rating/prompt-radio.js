'use strict';

const colors = require('ansi-colors');
const { Rating } = require('enquirer');
const prompt = new Rating({
  name: 'experience',
  message: 'Please rate your experience',
  min: 0,
  margin: [0, 1, 1, 1],
  renderRatings: renderVertical,
  // renderRatings: renderHorizontal,
  space() {
    this.expanded = !this.expanded;
    this.render();
  },
  choicesHeader() {
    let header = colors.bold([1, 2, 3, 4, 5].join(' '.repeat(3)));
    let line = [this.margin[3], ' '.repeat(this.longest + 1), this.margin[1], header];
    return line.filter(Boolean).join(' ');
  },
  hint() {
    if (this.expanded === true) {
      return `(click <space> to collapse scale key)

  1 - Strongly Disagree
  2 - Disagree
  3 - Neutral
  4 - Agree
  5 - Strongly Agree
  `;
    }
    return '(click <space> to expand scale key)\n';
  },
  choices: [
    { name: 'shipping', message: 'Shipping', initial: 2 },
    { name: 'price', message: 'Price', initial: 2 },
    { name: 'quality', message: 'Quality', initial: 2 },
    { name: 'communication', message: 'Communication', initial: 2 },
    { name: 'experience', message: 'Overall Experience', initial: 2 }
  ]
});

prompt.run()
  .then(value => console.log(value))
  .catch(console.error);

function renderVertical(choice, i) {
  let { on, off } = this.symbols.radio;
  let sep = this.symbols.line;
  let numbers = [];
  let ratings = [];
  for (let i = 0; i < this.max; i++) {
    ratings.push(choice.idx === i ? this.styles.success(on) : off);
    numbers.push(i + 1);
  }
  if (choice.role === 'heading') {
    return '';
  }
  let res = ratings.join(' ' + sep.repeat(2));
  if (this.index === i) res = this.styles.primary(res);
  return res;
}

function renderHorizontal(choice, i) {
  let { on, off } = this.symbols.radio;
  let indent = str => `\n ${this.margin[3]}${str}`;
  let toLine = (arr, char = ' ', n = 6) => {
    let res = arr.join(' ' + char.repeat(n));
    return this.index === i ? this.styles.primary(res) : res;
  };
  let numbers = [];
  let ratings = [];
  for (let i = 0; i < this.max; i++) {
    ratings.push(choice.idx === i ? this.styles.success(on) : off);
    numbers.push(i + 1);
  }
  let res = toLine(ratings, this.symbols.line);
  let num = toLine(numbers);
  return indent(res) + indent(num) + '\n';
}
