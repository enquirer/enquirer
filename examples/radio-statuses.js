const Prompt = require('../recipes/radio');
const prompt = new Prompt({
  name: 'color',
  message: 'Pick a color',
  limit: 8,
  choices: [
    { message: 'Aqua',    name: 'aqua',    value: '#00ffff' },
    { message: 'Black',   name: 'black',   value: '#000000', disabled: '(Absence of color does not count)' },
    { message: 'Blue',    name: 'blue',    value: '#0000ff', success: '✔ the best color' },
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
    { message: 'White',   name: 'white',   value: '#ffffff', error: '(All the colors)' },
    { message: 'Yellow',  name: 'yellow',  value: '#ffff00' }
  ]
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
