'use strict';

const { NumberPrompt } = require('enquirer');
const placeholder = require('../../lib/placeholder');

const prompt = new NumberPrompt({
  name: 'amount',
  message: 'How much do you want to donate?',
  float: true,
  cursor: 1,
  format(input = this.input) {
    const str = Intl.NumberFormat(void 0, { style: 'currency', currency: 'USD' }).format(input);

    let pos = this.cursor + 1;

    // Total number of commas (,) in the formatted string
    const totalcommas = str.split(',').length - 1;

    // Number of commas (,) to the right of the current cursor position
    const extracommas =
      Intl.NumberFormat(void 0, { style: 'currency', currency: 'USD' })
        .format(
          input
            .toString(10)
            .split('')
            .slice(this.cursor)
            .join('')
        )
        .split(',').length - 1;

    pos += totalcommas - extracommas;

    // Check if `pos` is 'over' the comma (,)
    const diff = input.toString(10).split('').includes('.')
      ? input.toString(10).split('.')[1].length + 1
      : 3;
    if (str.length - pos - diff > 0 && !((str.length - pos - diff) % 4)) {
      if (this.state.keypress && this.state.keypress.name === 'left') {
        pos--;
      }
      if (this.state.keypress && this.state.keypress.name === 'right') {
        pos++;
      }
    }

    pos = Math.min(pos, str.length);

    let options = { input: str, pos, showCursor: true };
    return placeholder(this, options);
  }
});

prompt.run()
  .then(answer => console.log('Answer: $' + answer, 'dollars'))
  .catch(console.error);
