import createArrayPrompt from './array.js';
import createAuthPrompt from './auth.js';
import createBooleanPrompt from './boolean.js';
import createNumberPrompt from './number.js';
import createStringPrompt from './string.js';

export default function createTypes(platformShims) {
  return {
    ArrayPrompt: createArrayPrompt(platformShims),
    AuthPrompt: createAuthPrompt(platformShims),
    BooleanPrompt: createBooleanPrompt(platformShims),
    NumberPrompt: createNumberPrompt(platformShims),
    StringPrompt: createStringPrompt(platformShims)
  };
}
