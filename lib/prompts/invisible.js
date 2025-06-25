import StringPrompt from '../types/string.js';

class InvisiblePrompt extends StringPrompt {
  format() {
    return '';
  }
}

export default InvisiblePrompt;
