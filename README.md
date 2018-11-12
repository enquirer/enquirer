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
<b>Stylish CLI prompts that are user-friendly, intuitive and easy to create.</b><br>
<sub>>_ Prompts should be more like conversations than inquisitions▌<sub>
</p>

<br>

<p align="center">
<img src="https://github.com/enquirer/enquirer/raw/master/media/survey-prompt.gif" alt="Enquirer Survey Prompt" width="750">
</p>

<br>
<br>

Please consider starring or tweeting about this project to show your support. Thanks!

Created by [jonschlinkert](https://github.com/jonschlinkert) and [doowb](https://github.com/doowb), Enquirer is fast, easy to use, and lightweight enough for small projects, while also being powerful and customizable enough for the most advanced use cases.

* **Fast** - [Loads in ~4ms](#-performance) (that's about _3-4 times faster than a [single frame of a HD movie](http://www.endmemo.com/sconvert/framespersecondframespermillisecond.php) at 60fps_)
* **Lightweight** - Only one dependency, the excellent [ansi-colors](https://github.com/doowb/ansi-colors) by [Brian Woodward](https://github.com/doowb).
* **Easy to implement** - Uses promises and async/await and sensible defaults to make prompts easy to create and implement.
* **Easy to use** - Thrill your users with a better experience! Navigating around input and choices is a breeze. You can even create [quizzes](recipes/quiz.js), or [record](recipes/record.js) and [playback](recipes/play.js) keypresses to aid with tutorials and videos.
* **Intuitive** - Keypress combos are available to simplify usage.
* **Flexible** - All prompts can be used standalone or chained together.
* **Stylish** - Easily override semantic styles and symbols for any part of the prompt.
* **Extensible** - Easily create and use custom prompts by extending Enquirer's built-in [prompts](#-prompts).
* **Pluggable** - Add advanced features to Enquirer using plugins.
* **Validation** - Optionally validate user input with any prompt.
* **Well tested** - All prompts are well-tested, and tests are easy to create without having to use brittle, hacky solutions to spy on prompts or "inject" values.
* **Examples** - There are numerous [examples](examples) and [recipes](recipes) available to help you get started.

_(If you like Enquirer, you might also like [micromatch](https://github.com/micromatch/micromatch), created by [Jon Schlinkert](https://github.com/jonschlinkert), author of Enquirer)_.

<br>

<p align="center">
<b>Ready to start making prompts your users will love?</b><br>
<img src="https://github.com/enquirer/enquirer/raw/master/media/heartbeat.gif" alt="Enquirer Select Prompt with heartbeat example" width="750">
</p>

<br>
<br>

## ❯ Getting started

Get started with Enquirer, the most powerful and easy-to-use Node.js library for creating interactive CLI prompts.

* [Install](#-install)
* [Usage](#-usage)
* [Enquirer](#-enquirer)
* [Built-in Prompts](#-prompts)
* [Custom Prompts](#-custom-prompts)
* [Keypresses](#-keypresses)
* [Options](#-options)
* [Release History](#-release-history)
* [Performance](#-performance)
* [About](#-about)

<br>

## ❯ Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install enquirer
```

<p align="center">
<img src="https://github.com/enquirer/enquirer/raw/master/media/npm-install.gif" alt="Install Enquirer with NPM" width="750">
</p>

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

**Jump to**: [Getting Started](#-getting-started) · [Prompts](#-prompts) · [Options](#-options) · [Keypresses](#-keypresses)

<br>

## TODO

We're currently working on documentation for the following items. Please star and watch the repository for updates!

* [ ] Customizing symbols
* [ ] Customizing styles (palette)
* [ ] Customizing rendered input
* [ ] Customizing returned values
* [ ] Question validation
* [ ] Choice validation
* [ ] Skipping questions
* [ ] Async choices
* [ ] Async loaders, spinners and other timers
* [ ] Links to recipes

<br>

## ❯ Enquirer

The main export of this library is the `Enquirer` class. You can add Enquirer to your JavaScript project with following line of code.

```js
const Enquirer = require('enquirer');
```

### How does Enquirer work?

**Enquirer is a prompt runner**

Enquirer has methods and features designed to simplify running multiple prompts.

```js
const { prompt } = require('enquirer');
const question = [
  { 
    type: 'input', 
    name: 'username', 
    message: 'What is your username?' 
  },
  { 
    type: 'password', 
    name: 'password', 
    message: 'What is your password?' 
  }
];

let answers = await prompt(question);
console.log(answers);
```

**Prompts control how values are rendered and returned**

Each individual prompt is a class with special features and functionality for rendering the types of values you want to show users in the terminal, and subsequently returning the types of values you need to use in your application.

**How can I customize prompts?**

Below in this guide you will find information about creating [custom prompts](#-custom-prompts). For now, we'll focus on how to customize an existing prompt.

All of the individual [prompt classes](#built-in-prompts) in this library are exposed as static properties on Enquirer. This allows them to be used directly (without using `enquirer.prompt()`.

Use this approach if you need to modify a prompt instance, or listen for events on the prompt.

**Example**

```js
const { Input } = require('enquirer');
const prompt = new Input({ 
  name: 'username', 
  message: 'What is your username?' 
});

let answer = await prompt.run();
console.log('Username:', answer);
```

### [Enquirer](index.js#L20)

Create an instance of `Enquirer`.

**Params**

* `options` **{Object}**: (optional) Options to use with all prompts.
* `answers` **{Object}**: (optional) Answers object to initialize with.

**Example**

```js
const Enquirer = require('enquirer');
const enquirer = new Enquirer();
```

### [register](index.js#L42)

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

### [prompt](index.js#L78)

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

### [use](index.js#L151)

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

### [Enquirer#prompt](index.js#L212)

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

* [Built-in prompts](#built-in-prompts)
* [Prompt Options](#options)

### Built-in prompts

* [Prompt](#prompt) - The base `Prompt` class used by other prompts
* [AutoComplete](#autocomplete-prompt)
* [Confirm](#confirm-prompt)
* [Form](#form-prompt)
* [hSelect](#hselect-prompt) (horizontal select)
* [hMultiSelect](#hmultiselect-prompt) (horizontal multiselect)
* [Input](#input-prompt)
* [Invisible](#invisible-prompt)
* [List](#list-prompt)
* [MultiSelect](#multiselect-prompt)
* [Number](#number-prompt)
* [Password](#password-prompt)
* [Select](#select-prompt)
* [Snippet](#snippet-prompt)
* [Sort](#sort-prompt)
* [Survey](#survey-prompt)
* [Text](#input-prompt) (alias for the [Input prompt](#input-prompt))

### Prompt

The base `Prompt` class is used to create all other prompts.

```js
const { Prompt } = require('enquirer');
class MyCustomPrompt extends Prompt {}
```

See the documentation for [creating custom prompts](#-custom-prompts) to learn more about how this works.

### AutoComplete Prompt

Prompt that auto-completes as the user types, and returns the selected value as a string.

<p align="center">
<img src="https://github.com/enquirer/enquirer/raw/master/media/autocomplete-prompt.gif" alt="Enquirer AutoComplete Prompt" width="750">
</p>

**Example Usage**

```js
const question = {
  type: 'autocomplete',
  name: 'country',
  message: 'Where to?',
  limit: 5,
  suggest(input, choices) {
    return choices.filter(choice => choice.message.startsWith(input));
  },
  choices: [
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    ...
  ]
};
```

**AutoComplete Options**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `highlight` | `function` | `dim` version of primary style | The color to use when "highlighting" characters in the list that match user input. |
| `multiple`  | `boolean` | `false` | Allow multiple choices to be selected. |
| `suggest`   | `function` | Greedy match, returns true if choice message contains input string. | Function that filters choices. Takes user input and a choices array, and returns a list of matching choices. |

**Related prompts**

* [Select](#select-prompt)
* [MultiSelect](#multiselect-prompt)
* [Survey](#survey-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

<br>
<br>

### Confirm Prompt

Prompt that returns `true` or `false`.

<p align="center">
<img src="https://github.com/enquirer/enquirer/raw/master/media/confirm-prompt.gif" alt="Enquirer Confirm Prompt" width="750">
</p>

**Related prompts**

* [Input](#input-prompt)
* [Numeral](#numeral-prompt)
* [Password](#password-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

<br>
<br>

### Form Prompt

Prompt that allows the user to enter and submit multiple values on a single terminal screen.

<p align="center">
<img src="https://github.com/enquirer/enquirer/raw/master/media/form-prompt.gif" alt="Enquirer Form Prompt" width="750">
</p>

**Related prompts**

* [Input](#input-prompt)
* [Survey](#survey-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

<br>
<br>

### hSelect Prompt

The `hSelect` (Horizontal Select) allows the user to select from a horizontal list of choices.

<p align="center">
<img src="https://github.com/enquirer/enquirer/raw/master/media/hselect-prompt.gif" alt="Enquirer Horizontal Select / hSelect Prompt" width="750">
</p>

**Related prompts**

* [Select](#select-prompt)
* [MultiSelect](#multiselect-prompt)
* [Hmultiselect](#hmultiselect-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

<br>
<br>

### hMultiSelect Prompt

The `hMultiSelect` (Horizontal MultiSelect) allows the user to select multiple items from a horizontal list of choices.

<p align="center">
<img src="https://github.com/enquirer/enquirer/raw/master/media/hmultiselect-prompt.gif" alt="Enquirer Horizontal MultiSelect / hMultiSelect Prompt" width="750">
</p>

**Related prompts**

* [Select](#select-prompt)
* [Hselect](#hselect-prompt)
* [MultiSelect](#multiselect-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

<br>
<br>

### Input Prompt

Prompt that takes user input and returns a string.

<p align="center">
<img src="https://github.com/enquirer/enquirer/raw/master/media/input-prompt.gif" alt="Enquirer Input Prompt" width="750">
</p>

**Usage**

Usage with Enquirer.

```js
const { prompt } = require('enquirer');
const question = { 
  type: 'input', 
  name: 'username', 
  message: 'What is your username?' 
};

let answers = await prompt(question);
console.log('Username:', answers.username);
```

Usage as a standalone prompt. Use this approach if you need to modify the prompt instance, or listen for events on the prompt.

```js
const { Input } = require('enquirer');
const prompt = new Input({ 
  name: 'username', 
  message: 'What is your username?' 
});

let answer = await prompt.run();
console.log('Username:', answer);
```

**Related prompts**

* [Confirm](#confirm-prompt)
* [Numeral](#numeral-prompt)
* [Password](#password-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

<br>
<br>

### Invisible Prompt

Prompt that takes user input, hides it from the terminal, and returns a string.

<p align="center">
<img src="https://github.com/enquirer/enquirer/raw/master/media/invisible-prompt.gif" alt="Enquirer Invisible Prompt" width="750">
</p>

**Related prompts**

* [Password](#password-prompt)
* [Input](#input-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

<br>
<br>

### List Prompt

Prompt that returns a list of values, created by splitting the user input. The default split character is `,` with optional trailing whitespace.

<p align="center">
<img src="https://github.com/enquirer/enquirer/raw/master/media/list-prompt.gif" alt="Enquirer List Prompt" width="750">
</p>

**Related prompts**

* [Sort](#sort-prompt)
* [Select](#select-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

<br>
<br>

### MultiScale Prompt

Prompt that allows the user to quickly provide feedback using a [Likert Scale](https://en.wikipedia.org/wiki/Likert_scale).

<p align="center">
<img src="https://github.com/enquirer/enquirer/raw/master/media/multiscale-prompt.gif" alt="Enquirer MultiScale Prompt" width="750">
</p>

**Related prompts**

* [AutoComplete](#autocomplete-prompt)
* [Select](#select-prompt)
* [Survey](#survey-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

<br>
<br>

### MultiSelect Prompt

Prompt that allows the user to select multiple items from a list of options.

<p align="center">
<img src="https://github.com/enquirer/enquirer/raw/master/media/multiselect-prompt.gif" alt="Enquirer MultiSelect Prompt" width="750">
</p>

**Related prompts**

* [Select](#select-prompt)
* [AutoComplete](#autocomplete-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

<br>
<br>

### Numeral Prompt

Prompt that takes a number as input.

<p align="center">
<img src="https://github.com/enquirer/enquirer/raw/master/media/numeral-prompt.gif" alt="Enquirer Numeral Prompt" width="750">
</p>

**Related prompts**

* [Input](#input-prompt)
* [Confirm](#confirm-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

<br>
<br>

### Password Prompt

Prompt that takes user input and masks it in the terminal. Also see the [invisible prompt](#invisible-prompt)

<p align="center">
<img src="https://github.com/enquirer/enquirer/raw/master/media/password-prompt.gif" alt="Enquirer Password Prompt" width="750">
</p>

**Related prompts**

* [Input](#input-prompt)
* [Invisible](#invisible-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

<br>
<br>

### Select Prompt

Prompt that allows the user to select from a list of options.

<p align="center">
<img src="https://github.com/enquirer/enquirer/raw/master/media/select-prompt.gif" alt="Enquirer Select Prompt" width="750">
</p>

**Related prompts**

* [AutoComplete](#autocomplete-prompt)
* [MultiSelect](#multiselect-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

<br>
<br>

### Snippet Prompt

Prompt that allows the user to replace placeholders in a snippet of code or text.

<p align="center">
<img src="https://github.com/enquirer/enquirer/raw/master/media/snippet-prompt.gif" alt="Prompts" width="750">
</p>

**Related prompts**

* [Survey](#survey-prompt)
* [AutoComplete](#autocomplete-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

<br>
<br>

### Sort Prompt

Prompt that allows the user to sort items in a list.

**Example**

In this [example](https://github.com/enquirer/enquirer/raw/master/examples/sort/prompt.js), custom styling is applied to the returned values to make it easier to see what's happening.

<p align="center">
<img src="https://github.com/enquirer/enquirer/raw/master/media/sort-prompt.gif" alt="Enquirer Sort Prompt" width="750">
</p>

**Related prompts**

* [List](#list-prompt)
* [Select](#select-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

<br>
<br>

### Survey Prompt

Prompt that allows the user to provide feedback for a list of questions.

<p align="center">
<img src="https://github.com/enquirer/enquirer/raw/master/media/survey-prompt.gif" alt="Enquirer Survey Prompt" width="750">
</p>

**Related prompts**

* [MultiScale](#multiscale-prompt)
* [Snippet](#snippet-prompt)
* [Select](#select-prompt)

<br>
<br>

## ❯ Types

Enquirer 2.0 introduced the concept of prompt "types", with the goal of making custom prompts easier than ever to create and use. There are 4 (soon to be 5!) type classes:

* [ArrayPrompt](#arrayprompt)
* [BooleanPrompt](#booleanprompt)
* DatePrompt (Coming Soon!)
* [NumberPrompt](#numberprompt)
* [StringPrompt](#stringprompt)

Each type is a low-level class that may be used as a starting point for creating higher level prompts. Continue reading to learn how.

### ArrayPrompt

The `ArrayPrompt` class is used for creating prompts that display a list of choices in the terminal. For example, Enquirer uses this class as the basis for the [Select](#select) and [Survey](#survey) prompts.

#### Options

In addition to the [options](#options) available to all prompts, Array prompts also support the following options.

| **Option** | **Required?** | **Type** | **Description** |
| --- | --- | --- | --- |
| `type`      | `Yes` | `string\|function` | Enquirer uses this value to determine the type of prompt to run, but it's optional when prompts are run directly. |
| `name`      | `Yes` | `string\|function` | Used as the key for the answer on the returned values (answers) object. |
| `message`   | `Yes` | `string\|function` | The message to display when the prompt is rendered in the terminal. |
| `autofocus` | `no`  | `string\|number` | The index or name of the choice that should have focus when the prompt loads. Only one choice may have focus at a time. |
| `initial`   | `no`  | `string\|function` | The default value to return when the user does not supply a value. |
| `format`    | `no`  | `function` | Function to format user input in the terminal. |
| `result`    | `no`  | `function` | Function to format the final submitted value before it's returned. |
| `stdin`     | `no`  | `stream`   | The input stream to use for emitting keypress events. Defaults to `process.stdin`. |
| `stdout`    | `no`  | `stream`   | The output stream to use for writing the prompt to the terminal. Defaults to `process.stdout`. |
| `validate`  | `no`  | `function` | Function to validate the submitted value before it's returned. This function may return a boolean or a string. If a string is returned it will be used as the validation error message. |

#### Properties

Array prompts have the following instance properties and getters.

| **Property name** | **Type** | **Description** |
| --- | --- | --- |
| `choices`   | `array`  | Array of choices that have been normalized from choices passed on the prompt options. |
| `cursor`    | `number` | Position of the cursor relative to the _user input (string)_. |
| `enabled`   | `array`  | Returns an array of enabled choices. |
| `focused`   | `array`  | Returns the currently selected choice in the visible list of choices. This is similar to the concept of focus in HTML and CSS. Focused choices are always visible (on-screen). When a list of choices is longer than the list of visible choices, and an off-screen choice is _focused_, the list will scroll to the focused choice and re-render. |
| `focused` | Gets the currently selected choice. Equivalent to `prompt.choices[prompt.index]`. |
| `index`     | `number` | Position of the pointer in the _visible list (array) of choices_. |
| `limit`     | `number` | The number of choices to display on-screen. |
| `selected`  | `array`  | Either a list of enabled choices (when `options.multiple` is true) or the currently focused choice. |
| `visible`   | `string` |  |

#### Methods

| **Method** | **Description** |
| --- | --- |
| `pointer()`   | Returns the visual symbol to use to identify the choice that currently has focus. The `❯` symbol is often used for this. The pointer is not always visible, as with the `autocomplete` prompt. |
| `indicator()` | Returns the visual symbol that indicates whether or not a choice is checked/enabled. |
| `focus()`     | Sets focus on a choice, if it can be focused. |

#### Choices

Array prompts support the `choices` option, which is the array of choices users will be able to select from when rendered in the terminal.

**Type**: `string|object`

**Example**

```js
const { prompt } = require('enquirer');

const questions = [{
  type: 'select',
  name: 'color',
  message: 'Favorite color?',
  initial: 1,
  choices: [
    { name: 'red',   message: 'Red',   value: '#ff0000' }, //<= choice object
    { name: 'green', message: 'Green', value: '#00ff00' }, //<= choice object
    { name: 'blue',  message: 'Blue',  value: '#0000ff' }  //<= choice object
  ]
}];

let answers = await prompt(questions);
console.log('Answer:', answers.color);
```

#### Defining choices

Whether defined as a string or object, choices are normalized to the following interface:

```js
{
  name: string;
  message: string | undefined;
  value: string | undefined;
  hint: string | undefined;
  disabled: boolean | string | undefined;
}
```

**Example**

```js
const question = {
  name: 'fruit',
  message: 'Favorite fruit?'
  choices: ['Apple', 'Orange', 'Raspberry']
};

// Normalizes to the following when the prompt is run:
// 
// const question = {
//   name: 'fruit',
//   message: 'Favorite fruit?'
//   choices: [
//     { name: 'Apple', message: 'Apple', value: 'Apple' },
//     { name: 'Orange', message: 'Orange', value: 'Orange' },
//     { name: 'Raspberry', message: 'Raspberry', value: 'Raspberry' }
//   ]
// }
```

#### Choice properties

The following properties are supported on `choice` objects.

| **Option**  | **Type**   | **Description**  |
| --- | --- | --- |
| `name`     | `string` | The unique key to identify a choice |
| `message`  | `string` | The message to display in the terminal. `name` is used when this is undefined.  |
| `value`    | `string` | Value to associate with the choice. Useful for creating key-value pairs from user choices. `name` is used when this is undefined. |
| `choices`    | `array` | Array of "child" choices. |
| `hint`     | `string` | Help message to display next to a choice. |
| `role`     | `string` | Determines how the choice will be displayed. Currently the only role supported is `separator`. Additional roles may be added in the future (like `heading`, etc). Please create a [feature request] |
| `enabled` | `boolean` | Enabled a choice by default. This is only supported when `options.multiple` is true or on prompts that support multiple choices, like [MultiSelect](#-multiselect). |
| `disabled` | `boolean\|string` | Disable a choice so that it cannot be selected. This value may either be `true`, `false`, or a message to display. |
| `indicator` | `string\|function` | Custom indicator to render for a choice (like a check or radio button). |

#### Related prompts

* [AutoComplete](#autocomplete-prompt)
* [Form](#form-prompt)
* [MultiSelect](#multiselect-prompt)
* [Select](#select-prompt)
* [Survey](#survey-prompt)

### BooleanPrompt

The `BooleanPrompt` class is used for creating prompts that display and return a boolean value.

**Returns**: `boolean`

### NumberPrompt

The `NumberPrompt` class is used for creating prompts that display and return a numerical value.

**Returns**: `string|number` (number, or number formatted as a string)

### StringPrompt

The `StringPrompt` class is used for creating prompts that display and return a string value.

<br>

## ❯ Custom prompts

With Enquirer 2.0, custom prompts are easier than ever to create and use.

**How do I create a custom prompt?**

Custom prompts are created by extending Enquirer's `Prompt` class, or one of the built-in [prompts](#-prompts) or low-level [types](#-types).

```js
const { Prompt } = require('enquirer');

class HaiKarate extends Prompt {
  constructor(options = {}) {
    super(options);
    this.value = options.initial || 0;
    this.cursorHide();
  }
  up() {
    this.value++;
    this.render();
  }
  down() {
    this.value--;
    this.render();
  }
  render() {
    this.clear(); // clear previously rendered prompt from the terminal
    this.write(`${this.state.message}: ${this.value}`);
  }
}
```

Custom prompts may be used directly by creating an instance of your custom prompt class.

```js
const prompt = new HaiKarate({
  message: 'How many sprays do you want?',
  initial: 10
});

prompt.run()
  .then(answer => console.log('Sprays:', answer))
  .catch(console.error);

```

To register a custom prompt, you must first instantiate `Enquirer`.

```js
const Enquirer = require('enquirer');
const enquirer = new Enquirer();
```

Then use the `.register()` method to add your custom prompt.

```js
enquirer.register('haikarate', HaiKarate);
```

Now you can do the following when defining "questions".

```js
let spritzer = require('cologne-drone');
let answers = await enquirer.prompt([
  {
    type: 'haikarate',
    name: 'cologne',
    message: 'How many sprays do you need?',
    initial: 10,
    async onSubmit(name, value) {
      await spritzer.activate(value); //<= activate drone 
      return value;
    }
  }
]);
```

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

Each prompt takes an options object (aka "question" object), that implements the following interface:

```js
{
  // required
  type: string | function,
  name: string | function,
  message: string | function | async function,

  // optional 
  initial: string | function | async function
  format: function | async function,
  result: function | async function,
  validate: function | async function
}
```

### General options

All prompts take the following options.

| **Property** | **Required?** | **Type** | **Description** |
| --- | --- | --- | --- |
| `type`     | Yes | `string\|function` | Enquirer uses this value to determine the type of prompt to run, but it's optional when prompts are run directly. |
| `name`     | Yes | `string\|function` | Used as the key for the answer on the returned values (answers) object. |
| `message`  | Yes | `string\|function` | The message to display when the prompt is rendered in the terminal. |
| `initial`  | no | `string\|function` | The default value to return if the user does not supply a value. |
| `format`   | no | `function` | Function to format user input in the terminal. |
| `result`   | no | `function` | Function to format the final submitted value before it's returned. |
| `validate` | no | `function` | Function to validate the submitted value before it's returned. This function may return a boolean or a string. If a string is returned it will be used as the validation error message. |

**Example usage**

```js
const { prompt } = require('enquirer');

const question = {
  type: 'input',
  name: 'username',
  message: 'What is your username?'
};

prompt(question)
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
```

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
