import createStringPrompt from '../types/string.js';

export default function createInvisiblePrompt(platformShims) {
  const StringPrompt = createStringPrompt(platformShims);

  class InvisiblePrompt extends StringPrompt {
    format() {
      return '';
    }
  }

  return InvisiblePrompt;
}
