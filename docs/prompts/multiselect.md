# MultiSelect Prompt

The MultiSelect prompt allows the user to select multiple items from a list of options.

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/multiselect-prompt.gif" alt="Enquirer MultiSelect Prompt" width="750">
</p>

## Options

**Todo**

- [ ] Custom pointer
- [ ] Custom indicator
- [ ] Custom indicator defined on choices
- [ ] Custom symbols
- [ ] Choice groups
- [ ] Choice roles
- [ ] Choice group headings
- [ ] Populating choices with other prompts 
- [ ] `options.initial` choice index
- [ ] `options.initial` choice name
- [ ] `options.initial` multiple choices
- [ ] Skipping choices
- [ ] Disabled choices
- [ ] Choice hints
- [ ] Timers
- [ ] Async choices
- [ ] Initial choice values


## Related prompts

- [Select](#select-prompt)
- [AutoComplete](#autocomplete-prompt)
- [Survey](#survey-prompt)


<!-- Example: Select favorite colors -->

```js
const { prompt } = require('enquirer');

const questions = [
  {
    type: 'multiselect',
    name: 'colors',
    message: 'Favorite colors?',
    choices: [
      { name: 'red', message: 'red', value: '#ff0000' }, //<= choice object
      { name: 'green', message: 'Green', value: '#00ff00' }, //<= choice object
      { name: 'blue', message: 'Blue', value: '#0000ff' } //<= choice object
    ]
  }
];

let answers = await prompt(questions);
console.log('Answer:', answers.colors);
```
