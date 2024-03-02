'use strict';

// Define roles directly without utils.merge
const roles = {
  default: (prompt, choice) => choice,
  checkbox: () => { throw new Error('checkbox role is not implemented yet'); },
  editable: () => { throw new Error('editable role is not implemented yet'); },
  expandable: () => { throw new Error('expandable role is not implemented yet'); },
  heading: (prompt, choice) => {
    choice.disabled = '';
    choice.indicator = choice.indicator || ' ';
    choice.message = choice.message || '';
    return choice;
  },
  input: () => { throw new Error('input role is not implemented yet'); },
  option: (prompt, choice) => roles.default(prompt, choice),
  radio: () => { throw new Error('radio role is not implemented yet'); },
  separator: (prompt, choice) => {
    choice.disabled = '';
    choice.indicator = choice.indicator || ' ';
    choice.message = choice.message || prompt.symbols.line.repeat(5);
    return choice;
  },
  spacer: (prompt, choice) => choice
};

module.exports = (name, options = {}) => {
  const role = roles[name] || roles.default;
  return (prompt, choice) => role(prompt, choice); // Return the role function directly
};
