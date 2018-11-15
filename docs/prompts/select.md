# MultiSelect Prompt

**Todo**

- [ ] Custom pointer
- [ ] Custom indicator
- [ ] Custom indicator defined on choices
- [ ] Custom symbols
- [ ] Choice groups
- [ ] Choice group headings
- [ ] Populating choices with other prompts
- [ ] Disabled choices
- [ ] Choice roles
- [ ] Choice hints
- [ ] Timers
- [ ] Async choices

## Options

Todo

## Usage examples

Todo

### Customize result

By default, select prompt returns the `name` property from the choice that was submitted by the user. If you need something different, you can a custom `result` function to the options ("question" object) to format the returned value however you want. 

```js
const questions = [
  {
    type: 'select',
    name: 'colors',
    message: 'Favorite color?',
    choices: [
      { name: 'red', message: 'red', value: '#ff0000' }, //<= choice object
      { name: 'green', message: 'Green', value: '#00ff00' }, //<= choice object
      { name: 'blue', message: 'Blue', value: '#0000ff' } //<= choice object
    ],
    result(value) {
      return value; // by default, "value" is the choice.name
    }
  }
];
```

When [multiple](#optionsmultiple) is `true`, the returned value is an array of names. We'll cover that below as well.

### Examples 

**name only**

Do nothing. This is the default behavior.

**value only**

If you want just the value from the selected choice, you can do the following:

```js
result() {
  // "focused" is the selected choice when multiple is not true
  return this.focused.value;
}
// { colors: '#ff0000' }
```

**properties (name and value)**

If you want both name and value, you can either iterate over the `this.choices` and do that however you want, or use the `.map` method:

```js
result(name) {
  // .map expects an array of names
  return this.map([name]);
}
// { colors: { red: '#ff0000' } }
```

**Choice objects**

You can also iterate over the choices and return the entire choice or whatever properties you want:

```js
result(value) {
  // this will return the entire choice object
  return this.choices.find(choice => choice.name === value);
}
```

## Multiselect 

With the `MultiSelect` prompt (or when `options.multiple` is true on the Select prompt), you can do the following:

```js
result(names) {
  return this.map(names);
}
```
