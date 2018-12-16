'use strict';

const colors = require('ansi-colors');
const { Scale } = require('enquirer');
const prompt = new Scale({
  name: 'experience',
  message: 'Please rate your experience',
  scale: 5,
  symbols: { line: ' ' },
  edgeLength: 1,
  styles: {
    primary: colors.blue
  },
  format() {
    return '';
  },
  renderScaleHeading() {
    return '';
  },
  scaleIndicator(choice, item, i) {
    let enabled = choice.scaleIndex >= item.index;
    let { on, disabled } = this.symbols.stars;
    if (choice.disabled) return this.styles.muted(disabled);
    if (enabled) {
      if (this.index === i) return this.styles.primary.dim(on);
      return this.styles.primary(on);
    }
    return this.styles.dark(on);
  },
  choices: [
    { name: 'shipping', message: '1. Shipping', initial: 2 },
    { name: 'price', message: '2. Price', initial: 2 },
    { name: 'quality', message: '3. Quality', initial: 2 },
    { name: 'communication', message: '4. Communication', initial: 2 },
    { name: 'experience', message: '5. Overall Experience', initial: 2 }
  ]
});

prompt.run()
  .then(value => console.log(value))
  .catch(console.error);
