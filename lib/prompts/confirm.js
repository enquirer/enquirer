import createBooleanPrompt from '../types/boolean.js';

export default function createConfirmPrompt(platformShims) {
  const BooleanPrompt = createBooleanPrompt(platformShims);

  class ConfirmPrompt extends BooleanPrompt {
    constructor(options) {
      super(options);
      this.default = this.options.default || (this.initial ? '(Y/n)' : '(y/N)');
    }
  }

  return ConfirmPrompt;
}

