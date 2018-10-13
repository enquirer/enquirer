# enquirer [![NPM version](https://img.shields.io/npm/v/enquirer.svg?style=flat)](https://www.npmjs.com/package/enquirer) [![NPM monthly downloads](https://img.shields.io/npm/dm/enquirer.svg?style=flat)](https://npmjs.org/package/enquirer) [![NPM total downloads](https://img.shields.io/npm/dt/enquirer.svg?style=flat)](https://npmjs.org/package/enquirer) [![Linux Build Status](https://img.shields.io/travis/enquirer/enquirer.svg?style=flat&label=Travis)](https://travis-ci.org/enquirer/enquirer)

> Stylish and user-friendly prompt system that is .

Please consider following this project's author, [Jon Schlinkert](https://github.com/jonschlinkert), and consider starring the project to show your :heart: and support.

## Why use this?

* **Fast** - Loads in ~4ms (that's about _3-4 times faster than a [single frame of a HD movie](https://github.com/KoryNunn/framerate) at 60fps_)
* **Lightweight** - Only [one dependency](https://github.com/doowb/ansi-colors)
* **Easy to use** - Uses promises, so prompts are easy to run, use, and compose.
* **Extensible** - Prompts are easy to create and extend.
* **Stylish** - Easily override default colors and symbols for any part of the prompt.
* **Validation** - Optionally validate user input with any prompt.
* **Well tested** - All prompts are well-tested. Tests easy to create, without having to use hacky solutions to spy on prompts or pass values.

### Why use Enquirer, instead of X?

Enquirer is just as fast, lightweight, and easy to use as [prompts](https://github.com/terkelg/prompts) and [inquirer](https://github.com/SBoudrias/Inquirer.js), but it's more powerful and customizable than both.

| **Feature** | **enquirer** | **prompts** | **Inquirer** |
| --- | --- | --- | --- | --- |
| Dependencies | 1 | 2 | 32 |
| Load time<sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup> | `8.019ms` | `25.653ms` (~10% slower) | `191.380ms` (~2,400% slower) |
| Class-based | ✔ | ✖ | ✖ |
| Plugins | ✔ | ✖ | ✖ |

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save enquirer
```

## Usage

```js
const { prompt } = require('enquirer');

// pass an array of "question" objects, or a single question object
const values = await prompt([
  {
    type: 'input',
    name: 'name',
    message: 'What is your name?' 
  },
  {
    type: 'input',
    name: 'username',
    message: 'What is your username?' 
  },
  {
    type: 'confirm',
    name: 'persist',
    message: 'Want to save?'
  }
]);

console.log('ANSWERS', values);
```

***

## Prompt options

Each prompt takes a options object, referred to as a "question" object, that implements the following interface:

```js
{
  type: string | function,
  name: string | function,
  message: string | function | async function,
  initial: string | function | async function
  format: function | async function,
  answer: function | async function,
  validate: function | async function
}
```

### Prompt options

| **Property** | **Type** | **Description** | 
| --- | --- | --- |
| `type` (required) | **{string | function}** | Enquirer uses this value to determine the type of prompt to run, but it's optional when prompts are run directly. |
| `name` (required) | **{string | function}** | Used as the key for the answer on the returned values (answers) object. |
| `message` (required) | **{string | function}** | The message to display when the prompt is rendered in the terminal. |
| `initial` (optional) | **{string | function}** | The default value to return if the user does not supply a value. |
| `format` (optional) | **{function}**
 | Function to format user input in the terminal. |
| `answer` (optional) | **{function}**
 | Function to format the submitted value before it's returned. |
| `validate` (optional) | **{function}**
 | Function to validate the submitted value before it's returned. This function may return a boolean or a string. If a string is returned it will be used as the validation error message. |

**Example**

```js
const question = {
  type: 'select',
  name: 'color',
  message: 'Favorite color?',
  initial: 1,
  choices: [
    { name: 'red',   message: 'Red',   value: '#ff0000' },
    { name: 'green', message: 'Green', value: '#00ff00' },
    { name: 'blue',  message: 'Blue',  value: '#0000ff' }
  ]
};
```

***

## Choices

### Choice object

```js
Choice {
  name: string;
  message: string | undefined;
  value: string | undefined;
  hint: string | undefined;
  disabled: boolean | string | undefined;
  enabled: boolean | undefined;
}
```

| **Property** | **Type** | **Description** | 
| --- | --- | --- |
| `name` | `string` | The unique id for a choice |
| `message` | `string` | The message to display |
| `value` | `string` | The value to return if the choice is selected |
| `alias` | `string` | Single character to use when keypress shortcuts are supported |
| `hint` | `string` |  |
| `error` | `string` |  |
| `disabled` | `boolean` |  |
| `separator` | `boolean` |  |
| `selected` | `boolean` |  |

## Credit

A few libraries influenced this library:

* [inquirer](https://github.com/SBoudrias/Inquirer.js) - `inquirer` inspired the class-based prompt concept we're using.
* [prompts](https://github.com/terkelg/prompts) - `prompts` inspired the simplicity of "actions" in our prompts. We really liked how the code was written, the lack of abstractions makes the code easy to work with an understand.
* [prompt-skeleton](https://github.com/derhuerst/prompt-skeleton) - The [prompts](https://github.com/terkelg/prompts) library is based on the work of [derhuerst](https://github.com/derhuerst) (including [prompt-skeleton](https://github.com/derhuerst/prompt-skeleton) and related libs).

## About

<details>
<summary><strong>Contributing</strong></summary>

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

</details>

<details>
<summary><strong>Running Tests</strong></summary>

Running and reviewing unit tests is a great way to get familiarized with a library and its API. You can install dependencies and run tests with the following command:

```sh
$ npm install && npm test
```

</details>

<details>
<summary><strong>Building docs</strong></summary>

_(This project's readme.md is generated by [verb](https://github.com/verbose/verb-generate-readme), please don't edit the readme directly. Any changes to the readme must be made in the [.verb.md](.verb.md) readme template.)_

To generate the readme, run the following command:

```sh
$ npm install -g verbose/verb#dev verb-generate-readme && verb
```

</details>

### Contributors

| **Commits** | **Contributor** | 
| --- | --- |
| 72 | [jonschlinkert](https://github.com/jonschlinkert) |
| 12 | [doowb](https://github.com/doowb) |
| 1 | [mischah](https://github.com/mischah) |
| 1 | [skellock](https://github.com/skellock) |

### Author

**Jon Schlinkert**

* [GitHub Profile](https://github.com/jonschlinkert)
* [Twitter Profile](https://twitter.com/jonschlinkert)
* [LinkedIn Profile](https://linkedin.com/in/jonschlinkert)

### License

Copyright © 2018, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT License](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.6.0, on October 12, 2018._

<hr class="footnotes-sep">
<section class="footnotes">
<ol class="footnotes-list">
<li id="fn1"  class="footnote-item">Load times are average times of three runs for each library. <a href="#fnref1" class="footnote-backref">↩</a>

</li>
</ol>
</section>