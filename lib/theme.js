import styles from './styles.js';
import symbols from './symbols.js';
import utils from './utils.js';

export default function theme(prompt) {
  prompt.options = utils.merge({}, prompt.options.theme, prompt.options);
  prompt.symbols = symbols.merge(prompt.options);
  prompt.styles = styles.merge(prompt.options);
};
