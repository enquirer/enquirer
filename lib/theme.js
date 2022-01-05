import createUtils from './utils.js';
import createStyles from './styles.js';
import createSymbols from './symbols.js';

export default function createTheme(platformShims) {
  const styles = createStyles(platformShims);
  const symbols = createSymbols(platformShims);
  const utils = createUtils(platformShims);

  return prompt => {
    prompt.options = utils.merge({}, prompt.options.theme, prompt.options);
    prompt.symbols = symbols.merge(prompt.options);
    prompt.styles = styles.merge(prompt.options);
  };
}
