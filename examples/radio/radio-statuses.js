const colors = require('ansi-colors');
const symbols = require('../../lib/style/symbols');
const Prompt = require('../../lib/prompts/radio');
const styles = {
  disabled: colors.gray,
  success: colors.green,
  warning: colors.yellow,
  info: colors.cyan,
  error: colors.magenta
};

const style = (line, choice) => {
  let key = Object.keys(choice).find(k => styles[k]);
  if (key) {
    line += ' ' + styles[key](choice[key]);
  }
  return line;
};

const prompt = new Prompt({
  name: 'color',
  message: 'Pick a color',
  limit: 8,
  renderChoice(choice, i) {
    return style(this._renderChoice(choice, i), choice);
  },
  choices: [
    { message: 'Aqua',    name: 'aqua',    value: '#00ffff' },
    { message: 'Black',   name: 'black',   value: '#000000', disabled: '(Absence of color does not count)' },
    { message: 'Blue',    name: 'blue',    value: '#0000ff', success: `${symbols.check} the best color` },
    { message: 'Fuchsia', name: 'fuchsia', value: '#ff00ff' },
    { message: 'Gray',    name: 'gray',    value: '#808080', info: '(Not a real color)' },
    { message: 'Green',   name: 'green',   value: '#008000' },
    { message: 'Lime',    name: 'lime',    value: '#00ff00' },
    { message: 'Maroon',  name: 'maroon',  value: '#800000' },
    { message: 'Navy',    name: 'navy',    value: '#000080' },
    { message: 'Olive',   name: 'olive',   value: '#808000', disabled: true },
    { message: 'Purple',  name: 'purple',  value: '#800080' },
    { message: 'Red',     name: 'red',     value: '#ff0000' },
    { message: 'Silver',  name: 'silver',  value: '#c0c0c0', warning: '(Also not a real color)' },
    { message: 'Teal',    name: 'teal',    value: '#008080' },
    { message: 'White',   name: 'white',   value: '#ffffff', danger: '(All the colors. So, also not a color)' },
    { message: 'Yellow',  name: 'yellow',  value: '#ffff00' }
  ]
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
