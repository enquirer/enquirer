import BooleanPrompt from '../types/boolean.js';

class ConfirmPrompt extends BooleanPrompt {
  constructor(options) {
    super(options);
    this.default = this.options.default || (this.initial ? '(Y/n)' : '(y/N)');
  }
}

export default ConfirmPrompt;

