---
layout: default
title: Examples
geopattern: c
---

## TODO

- [ ] custom pointer
- [ ] custom prefix
- [ ] customized `choice.line`
- [ ] customized message
- [ ] list
- [ ] choices
- [ ] choice group
- [ ] radio group

## List prompt

Add the following to `example.js`, then run `$ node example`:

```js
const enquirer = require('enquirer');
const question = {
  name: 'drink',
  message: 'What would you like to drink?',
  choices: [
    'Coke',
    'Diet Coke',
    'Cherry Coke',
    {name: 'Sprite', disabled: 'Temporarily unavailable'},
    'Water'
  ]
};

enquirer.list(question)
  .then()
```
