<h1 align="center">Enquirer</h1>

<p align="center">
<a href="https://npmjs.org/package/enquirer">
<img src="https://img.shields.io/npm/v/enquirer.svg" alt="version">
</a>
<a href="https://travis-ci.org/enquirer/enquirer">
<img src="https://img.shields.io/travis/enquirer/enquirer.svg" alt="travis">
</a>
<a href="https://npmjs.org/package/enquirer">
<img src="https://img.shields.io/npm/dm/enquirer.svg" alt="downloads">
</a>
</p>

<br>
<br>

<p align="center">
<b>Stylish CLI prompts that are user-friendly, intuitive and easy to create.</b></br>
<sub>>_ Prompts should be more like conversations than inquisitions▌<sub>
</p>

<br>

<p align="center">
<img src="https://github.com/enquirer/enquirer/raw/master/media/survey-prompt.gif" alt="Enquirer Survey Prompt" width="750">
</p>

<br>
<br>

Created by [jonschlinkert](https://github.com/jonschlinkert) and [doowb](https://github.com/doowb), Enquirer is fast, easy to use, and lightweight enough for small projects, while also being powerful and customizable enough for the most advanced use cases.

* **Fast** - [Loads in ~4ms](#-performance) (that's about _3-4 times faster than a [single frame of a HD movie](http://www.endmemo.com/sconvert/framespersecondframespermillisecond.php) at 60fps_)
* **Lightweight** - Only [one dependency](https://github.com/doowb/ansi-colors).
* **Easy to use** - Uses promises and async/await to make prompts easy to create and use.
* **Intuitive** - Navigating around input and choices is a breeze. Advanced keypress combos are available to simplify usage. You can even create [quizzes](recipes/quiz.js), or [record](recipes/record.js) and [playback](recipes/play.js) keypresses to aid with tutorials and videos.
* **Multilingual** - Easily add support for multiple languages.
* **Extensible** - Prompts are easy to create and extend.
* **Flexible** - All prompts can be used standalone or chained together.
* **Pluggable** - Add advanced features to Enquirer with plugins.
* **Stylish** - Easily override styles and symbols for any part of the prompt.
* **Validation** - Optionally validate user input with any prompt.
* **Well tested** - All prompts are well-tested, and tests are easy to create without having to use brittle, hacky solutions to spy on prompts or "inject" values.

<br>

## ❯ Getting started

Get started with Enquirer, the most powerful and easy-to-use Node.js library for creating interactive CLI prompts.

* [Install](#-install)
* [Usage](#-usage)
* [Enquirer API](#-enquirer-api)
* [Prompts](#-prompts)
* [Types](#-types)
* [Keypresses](#-keypresses)
* [Options](#-options)
* [Release History](#-release-history)
* [Performance](#-performance)
* [About](#-about)

<br>

## ❯ Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save enquirer
```

_(Requires Node.js 8.6 or higher. Please let us know if you need support for an earlier version by creating an [issue](../../issues/new).)_

<br>

## ❯ Usage

### Single prompt

The easiest way to get started with enquirer is to pass a [question object](#prompt-options) to the `prompt` method.

```js
const { prompt } = require('enquirer');

const response = await prompt({
  type: 'input',
  name: 'username',
  message: 'What is your username?' 
});

console.log(response); 
//=> { username: 'jonschlinkert' }
```

_(Examples with `await` need to be run inside an `async` function)_

### Multiple prompts

Pass an array of ["question" objects](#prompt-options) to run a series of prompts.

```js
const response = await prompt([
  {
    type: 'input',
    name: 'name',
    message: 'What is your name?' 
  },
  {
    type: 'input',
    name: 'username',
    message: 'What is your username?' 
  }
]);

console.log(response);
//=> { name: 'Edward Chan', username: 'edwardmchan' }
```

<br>

## ❯ Enquirer API

### [Enquirer](index.js#L19)

Create an instance of `Enquirer`.

**Params**

* `options` **{Object}**: (optional) Options to use with all prompts.
* `answers` **{Object}**: (optional) Answers object to initialize with.

**Example**

```js
const Enquirer = require('enquirer');
const enquirer = new Enquirer();
```

### [register](index.js#L41)

Register a custom prompt type.

**Params**

* `type` **{String}**
* `fn` **{Function|Prompt}**: `Prompt` class, or a function that returns a `Prompt` class.
* `returns` **{Object}**: Returns the Enquirer instance

**Example**

```js
const Enquirer = require('enquirer');
const enquirer = new Enquirer();
enquirer.register('customType', require('./custom-prompt'));
```

### [prompt](index.js#L77)

Prompt function that takes a "question" object or array of question objects, and returns an object with responses from the user.

**Params**

* `questions` **{Array|Object}**: Options objects for one or more prompts to run.
* `returns` **{Promise}**: Promise that returns an "answers" object with the user's responses.

**Example**

```js
const Enquirer = require('enquirer');
const enquirer = new Enquirer();

const response = await enquirer.prompt({
  type: 'input',
  name: 'username',
  message: 'What is your username?'
});
console.log(response);
```

### [use](index.js#L150)

Use an enquirer plugin.

**Params**

* `plugin` **{Function}**: Plugin function that takes an instance of Enquirer.
* `returns` **{Object}**: Returns the Enquirer instance.

**Example**

```js
const Enquirer = require('enquirer');
const enquirer = new Enquirer();
const plugin = enquirer => {
  // do stuff to enquire instance
};
enquirer.use(plugin);
```

### [Enquirer#prompt](index.js#L211)

Prompt function that takes a "question" object or array of question objects, and returns an object with responses from the user.

**Params**

* `questions` **{Array|Object}**: Options objects for one or more prompts to run.
* `returns` **{Promise}**: Promise that returns an "answers" object with the user's responses.

**Example**

```js
const { prompt } = require('enquirer');
const response = await prompt({
  type: 'input',
  name: 'username',
  message: 'What is your username?'
});
console.log(response);
```

## ❯ Prompts

* [AutoComplete](#autocomplete-prompt)
* [Confirm](#confirm-prompt)
* [Input](#input-prompt)
* [Invisible](#invisible-prompt)
* [List](#list-prompt)
* [Multiselect](#multiselect-prompt)
* [Number](#number-prompt)
* [Password](#password-prompt)
* [Select](#select-prompt)
* [Snippet](#snippet-prompt)
* [Sort](#sort-prompt)
* [Survey](#survey-prompt)
* `Text` (alias for [Input](#input-prompt))

### AutoComplete Prompt

Prompt that auto-completes as the user types, and returns the selected value as a string.

<p align="center">
<img src="https://github.com/enquirer/enquirer/raw/master/media/autocomplete-prompt.gif" alt="Enquirer Autocomplete Prompt" width="750">
</p>

**Related prompts**

* [select prompt](#select-prompt)
* [multiselect prompt](#multiselect-prompt)
* [survey prompt](#survey-prompt)

### Confirm Prompt

Prompt that returns `true` or `false`.

<p align="center">
<img src="https://github.com/enquirer/enquirer/raw/master/media/confirm-prompt.gif" alt="Enquirer Confirm Prompt" width="750">
</p>

**Related prompts**

* [input prompt](#input-prompt)
* [number prompt](#number-prompt)
* [password prompt](#password-prompt)

### Input Prompt

Prompt that takes user input and returns a string.

<p align="center">
<img src="https://github.com/enquirer/enquirer/raw/master/media/input-prompt.gif" alt="Enquirer Input Prompt" width="750">
</p>

**Related prompts**

* [confirm prompt](#confirm-prompt)
* [number prompt](#number-prompt)
* [password prompt](#password-prompt)

### Invisible Prompt

Prompt that takes user input, hides it from the terminal, and returns a string.

<p align="center">
<img src="https://github.com/enquirer/enquirer/raw/master/media/invisible-prompt.gif" alt="Enquirer Invisible Prompt" width="750">
</p>

**Related prompts**

* [password prompt](#password-prompt)
* [input prompt](#input-prompt)

### List Prompt

Prompt that returns a list of values, created by splitting the user input. The default split character is `,` with optional trailing whitespace.

<p align="center">
<img src="https://github.com/enquirer/enquirer/raw/master/media/list-prompt.gif" alt="Enquirer List Prompt" width="750">
</p>

**Related prompts**

* [sort prompt](#sort-prompt)
* [select prompt](#select-prompt)

### Multiselect Prompt

Prompt that allows the user to select multiple items from a list of options.

<p align="center">
<img src="https://github.com/enquirer/enquirer/raw/master/media/multiselect-prompt.gif" alt="Enquirer Multiselect Prompt" width="750">
</p>

**Related prompts**

* [select prompt](#select-prompt)
* [autocomplete prompt](#autocomplete-prompt)

### Number Prompt

Prompt that takes a number as input.

<p align="center">
<img src="https://github.com/enquirer/enquirer/raw/master/media/number-prompt.gif" alt="Enquirer Number Prompt" width="750">
</p>

**Related prompts**

* [input prompt](#input-prompt)
* [confirm prompt](#confirm-prompt)

### Password Prompt

Prompt that takes user input and masks it in the terminal. Also see the [invisible prompt](#invisible-prompt)

<p align="center">
<img src="https://github.com/enquirer/enquirer/raw/master/media/password-prompt.gif" alt="Enquirer Password Prompt" width="750">
</p>

**Related prompts**

* [input prompt](#input-prompt)
* [invisible prompt](#invisible-prompt)

### Select Prompt

Prompt that allows the user to select from a list of options.

<p align="center">
<img src="https://github.com/enquirer/enquirer/raw/master/media/select-prompt.gif" alt="Enquirer Select Prompt" width="750">
</p>

**Related prompts**

* [autocomplete prompt](#autocomplete-prompt)
* [multiselect prompt](#multiselect-prompt)

### Snippet Prompt

Prompt that allows the user to replace placeholders in a snippet of code or text.

<p align="center">
<img src="https://github.com/enquirer/enquirer/raw/master/media/snippet-prompt.gif" alt="Prompts" width="750">
</p>

**Related prompts**

* [survey prompt](#survey-prompt)
* [autocomplete prompt](#autocomplete-prompt)

### Sort Prompt

Prompt that allows the user to sort items in a list.

**Example**

In this [example](https://github.com/enquirer/enquirer/raw/master/examples/sort/prompt.js), custom styling is applied to the returned values to make it easier to see what's happening.

<p align="center">
<img src="https://github.com/enquirer/enquirer/raw/master/media/sort-prompt.gif" alt="Enquirer Sort Prompt" width="750">
</p>

**Related prompts**

* [list prompt](#list-prompt)
* [select prompt](#select-prompt)

### Survey Prompt

Prompt that allows the user to provide feedback for a list of questions.

<p align="center">
<img src="https://github.com/enquirer/enquirer/raw/master/media/survey-prompt.gif" alt="Enquirer Survey Prompt" width="750">
</p>

**Related prompts**

* [snippet prompt](#snippet-prompt)
* [select prompt](#select-prompt)

## ❯ Types

* [ArrayPrompt](#arrayprompt)
* [BooleanPrompt](#booleanprompt)
* DatePrompt (Coming Soon!)
* [NumberPrompt](#numberprompt)
* [StringPrompt](#stringprompt)

### ArrayPrompt

todo

### BooleanPrompt

todo

### NumberPrompt

todo

### StringPrompt

todo

## ❯ Keypresses

### All prompts

Key combinations that may be used with all prompts.

| **command** | **description** |
| ---: | --- |
| <kbd>ctrl</kbd>+<kbd>a</kdb> | Move the cursor to the first character in user input. |
| <kbd>ctrl</kbd>+<kbd>c</kbd> | Cancel the prompt. |
| <kbd>ctrl</kbd>+<kbd>g</kdb> | Reset the prompt to its initial state. |

### Move cursor

Key combinations that may be used on prompts that support user input, such as the [input prompt](#input-prompt), [password prompt](#password-prompt), and [invisible prompt](#invisible-prompt)).

| **command** | **description** |
| ---: | --- |
| <kbd>left</kbd> | Move the cursor forward one character. |
| <kbd>right</kbd> | Move the cursor back one character. |
| <kbd>ctrl</kbd>+<kbd>a</kbd> | Move cursor to the start of the line |
| <kbd>ctrl</kbd>+<kbd>e</kbd> | Move cursor to the end of the line |
| <kbd>ctrl</kbd>+<kbd>b</kbd> | Move cursor back one character |
| <kbd>ctrl</kbd>+<kbd>f</kbd> | Move cursor forward one character |
| <kbd>ctrl</kbd>+<kbd>x</kbd> | Toggle between first and cursor position |

## Select choices

These key combinations may be used on prompts that support _multiple_ choices, such as the [multiselect prompt](#multiselect-prompt), or the [select prompt](#select-prompt) when the `multiple` options is true.

| **command** | **description** |
| ---: | --- |
| <kbd>space</kbd> | Toggle the currently selected choice when `options.multiple` is true. |
| <kbd>number</kbd> | Move the pointer to the choice at the given index. Also toggles the selected choice when `options.multiple` is true. |
| <kbd>a</kbd> | Toggle all choices to be enabled or disabled. |
| <kbd>i</kbd> | Invert the current selection of choices. |
| <kbd>g</kbd> | Toggle the current choice group. |

### Hide/show choices

| **command** | **description** |
| ---: | --- |
| <kbd>fn</kbd>+<kbd>up</kbd> | Decrease the number of visible choices by one. |
| <kbd>fn</kbd>+<kbd>down</kbd> | Increase the number of visible choices by one. |

### Move/lock Pointer

| **command** | **description** |
| ---: | --- |
| <kbd>number</kbd> | Move the pointer to the choice at the given index. Also toggles the selected choice when `options.multiple` is true. |
| <kbd>up</kbd> | Move the pointer up. |
| <kbd>down</kbd> | Move the pointer down. |
| <kbd>ctrl</kbd>+<kbd>a</kbd> | Move the pointer to the first _visible_ choice. |
| <kbd>ctrl</kbd>+<kbd>e</kbd> | Move the pointer to the last _visible_ choice. |
| (mac) <kbd>fn</kbd>+<kbd>left</kbd> / (win) <kbd>home</kbd> | Move the pointer to the first choice in the choices array. |
| (mac) <kbd>fn</kbd>+<kbd>right</kbd> / (win) <kbd>end</kbd> | Move the pointer to the last choice in the choices array. |
| <kbd>shift</kbd>+<kbd>up</kbd> | Scroll up one choice without changing pointer position (locks the pointer while scrolling). |
| <kbd>shift</kbd>+<kbd>down</kbd> | Scroll down one choice without changing pointer position (locks the pointer while scrolling). |

<br>

## ❯ Options

### Prompt options

Each prompt takes an options object (aka "question" object), that implements the following interface:

```js
{
  type: string | function,
  name: string | function,
  message: string | function | async function,
  initial: string | function | async function
  format: function | async function,
  result: function | async function,
  validate: function | async function
}
```

| **Property** | **Type** | **Description** |
| --- | --- | --- |
| `type` | `string\|function` | Enquirer uses this value to determine the type of prompt to run, but it's optional when prompts are run directly. |
| `name` | `string\|function` | Used as the key for the answer on the returned values (answers) object. |
| `message` | `string\|function` | The message to display when the prompt is rendered in the terminal. |
| `initial` | `string\|function` | The default value to return if the user does not supply a value. |
| `format` | `function` | Function to format user input in the terminal. |
| `result` | `function` | Function to format the final submitted value before it's returned. |
| `validate` | `function` | Function to validate the submitted value before it's returned. This function may return a boolean or a string. If a string is returned it will be used as the validation error message. |

_(`type`, `name` and `message` are required)._

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

### Choice objects

```js
Choice {
  name: string;
  message: string | undefined;
  value: string | undefined;
  hint: string | undefined;
  disabled: boolean | string | undefined;
}
```

| **Property**  | **Type**   | **Description**  |
| --- | --- | --- |
| `name`        | `string`   | The unique key to identify a choice |
| `message`     | `string`   | The message to display in the terminal |
| `value`       | `string`   | An optional value to associate with the choice. This is useful for creating key-value pairs from user choices. |
| `hint`        | `string`   | Value to display to provide user help next to a choice. |
| `disabled`    | `boolean\|string` | Disable a choice so that it cannot be selected. This value may either be `true`, `false`, or a message to display. |

<br>

## ❯ Release History

Please see [CHANGELOG.md](CHANGELOG.md).

## ❯ Performance

MacBook Pro, Intel Core i7, 2.5 GHz, 16 GB.

### Load time

Time it takes for the module to load the first time (average of 3 runs):

```
enquirer: 4.013ms
inquirer: 286.717ms
prompts: 17.010ms
```

<br>

## ❯ About

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
| 1  | [mischah](https://github.com/mischah) |  
| 1  | [skellock](https://github.com/skellock) |  

### Author

**Jon Schlinkert**

* [GitHub Profile](https://github.com/jonschlinkert)
* [Twitter Profile](https://twitter.com/jonschlinkert)
* [LinkedIn Profile](https://linkedin.com/in/jonschlinkert)

### Credit

Thanks to [derhuerst](https://github.com/derhuerst), creator of prompt libraries such as [prompt-skeleton](https://github.com/derhuerst/prompt-skeleton), which influenced some of the concepts we used in our prompts.

### License

Copyright © 2018, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT License](LICENSE).