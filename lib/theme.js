import styles from './styles.js';
import symbols from './symbols.js';
import * as utils from './utils.js';

export default function(prompt) {
  prompt.options = utils.merge({}, prompt.options.theme, prompt.options);
  prompt.symbols = symbols.merge(prompt.options);
  prompt.styles = styles.merge(prompt.options);
}
