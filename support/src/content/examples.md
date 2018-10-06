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

**Install prompt-list**

```sh
$ npm install prompt-list
```

Add the following to `example.js`, then run `$ node example`:

```js
var Prompt = require('prompt-list');
var prompt = new Prompt({
  name: 'drink',
  message: 'What would you like to drink?',
  choices: [
    'Coke',
    'Diet Coke',
    'Cherry Coke',
    {name: 'Sprite', disabled: 'Temporarily unavailable'},
    'Water'
  ]
});

prompt.ask(function(answer) {
  console.log(answer);
});
```
