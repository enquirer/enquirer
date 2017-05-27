---
layout: default
slug: index
geopattern: e
---

## What is enquirer?

Enquirer is a node.js library for composing and running prompts in the terminal.

**What's different about enquirer?**

Enquirer itself can be thought of as a "prompt runner" that only ships with one prompt type, [input][prompt-text], and additional [prompt types](#prompt-types) are added as plugins.

This makes enquirer lighter, faster, easier to maintain and easier to extend than other prompt libraries, like [inquirer][]. Enquirer also supports the same question formats as [inquirer][], as well as additional formats that make it easier to create.

### Prompt types

The following prompt types are maintained by the Enquirer core team. Each is published as a separate library and can be used completely standalone, or as a plugin to Enquirer.

{{> prompt-types }}

Visit the [prompts documentation](prompts.html) to learn more about using, discovering and authoring prompts.

## Quickstart

**1. Install**

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save enquirer
```

**2. Prompt**

Add the following code to `example.js` then run `$ node example`:

```js
var Enquirer = require('enquirer');
var enquirer = new Enquirer();

enquirer.question('first', 'First name?');
enquirer.question('last', 'Last name?');

enquirer.prompt(['first', 'last'])
  .then(function(answers) {
    console.log(answers)
  });
```

## Next steps

- Visit the [enquirer documentation](docs.html) for more detailed usage instructions.
- [Discover prompts](https://www.npmjs.com/browse/keyword/{{@site.name}}) created by the community or the Enquirer core team
- Learn how to [Author prompts](prompts.html)
- [See examples](examples.html)
