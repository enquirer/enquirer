# Enquirer's Prompts

In this section you'll learn about Enquirer's prompts: what they look like, how they work, how to run them, available options, and how to customize the prompts or create your own prompt concept.

**Getting started with Enquirer's prompts**

- [Prompt](#prompt) - The base `Prompt` class used by other prompts
  * [Prompt Options](#prompt-options)
  * [Prompt Types](#prompt-types) - The base `Prompt` class used by other prompts
- [Built-in prompts](#built-in-prompts)

## Prompt

The base `Prompt` class is used to create all other prompts.

```js
const { Prompt } = require('enquirer');
class MyCustomPrompt extends Prompt {}
```

See the documentation for [creating custom prompts](#-custom-prompts) to learn more about how this works.

### Prompt Options

Each prompt takes an options object (aka "question" object), that implements the following interface:

```js
{
  // required
  type: string | function,
  name: string | function,
  message: string | function | async function,

  // optional
  skip: boolean | function | async function,
  initial: string | function | async function,
  format: function | async function,
  result: function | async function,
  validate: function | async function,
}
```

### General options

All prompts take the following properties.

| **Property** | **Required?** | **Type**           | **Description**                                                                                                                                                                         |
| ------------ | ------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`       | yes           | `string|function`  | Enquirer uses this value to determine the type of prompt to run, but it's optional when prompts are run directly.                                                                       |
| `name`       | yes           | `string|function`  | Used as the key for the answer on the returned values (answers) object.                                                                                                                 |
| `message`    | yes           | `string|function`  | The message to display when the prompt is rendered in the terminal.                                                                                                                     |
| `skip`       | no            | `boolean|function` | If `true` it will not ask that prompt.                                                                                                                                                  |
| `initial`    | no            | `string|function`  | The default value to return if the user does not supply a value.                                                                                                                        |
| `format`     | no            | `function`         | Function to format user input in the terminal.                                                                                                                                          |
| `result`     | no            | `function`         | Function to format the final submitted value before it's returned.                                                                                                                      |
| `validate`   | no            | `function`         | Function to validate the submitted value before it's returned. This function may return a boolean or a string. If a string is returned it will be used as the validation error message. |

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

## Built-in prompts

- [Enquirer's Prompts](#enquirers-prompts)
  - [Prompt](#prompt)
    - [Prompt Options](#prompt-options)
    - [General options](#general-options)
  - [Built-in prompts](#built-in-prompts)
  - [AutoComplete Prompt](#autocomplete-prompt)
  - [Confirm Prompt](#confirm-prompt)
  - [Form Prompt](#form-prompt)
  - [Input Prompt](#input-prompt)
  - [Invisible Prompt](#invisible-prompt)
  - [List Prompt](#list-prompt)
  - [MultiSelect Prompt](#multiselect-prompt)
  - [Numeral Prompt](#numeral-prompt)
  - [Password Prompt](#password-prompt)
  - [Scale Prompt](#scale-prompt)
  - [Select Prompt](#select-prompt)
  - [Sort Prompt](#sort-prompt)
  - [Snippet Prompt](#snippet-prompt)
  - [Survey Prompt](#survey-prompt)
  - [Toggle Prompt](#toggle-prompt)
- [❯ Prompt Types](#%E2%9D%AF-prompt-types)
  - [ArrayPrompt](#arrayprompt)
    - [Options](#options)
    - [Properties](#properties)
    - [Methods](#methods)
    - [Choices](#choices)
    - [Defining choices](#defining-choices)
    - [Choice properties](#choice-properties)
    - [Related prompts](#related-prompts)
  - [BooleanPrompt](#booleanprompt)
  - [NumberPrompt](#numberprompt)
  - [StringPrompt](#stringprompt)
- [❯ Custom prompts](#%E2%9D%AF-custom-prompts)

## AutoComplete Prompt

Prompt that auto-completes as the user types, and returns the selected value as a string.

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/autocomplete-prompt.gif" alt="Enquirer AutoComplete Prompt" width="750">
</p>

**Related prompts**

- [Select](#select-prompt)
- [MultiSelect](#multiselect-prompt)
- [Survey](#survey-prompt)

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

| Option      | Type       | Default                                                             | Description                                                                                                  |
| ----------- | ---------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `highlight` | `function` | `dim` version of primary style                                      | The color to use when "highlighting" characters in the list that match user input.                           |
| `multiple`  | `boolean`  | `false`                                                             | Allow multiple choices to be selected.                                                                       |
| `suggest`   | `function` | Greedy match, returns true if choice message contains input string. | Function that filters choices. Takes user input and a choices array, and returns a list of matching choices. |

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

<br>
<br>

## Confirm Prompt

Prompt that returns `true` or `false`.

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/confirm-prompt.gif" alt="Enquirer Confirm Prompt" width="750">
</p>

**Related prompts**

- [Input](#input-prompt)
- [Numeral](#numeral-prompt)
- [Password](#password-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

<br>
<br>

## Form Prompt

Prompt that allows the user to enter and submit multiple values on a single terminal screen.

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/form-prompt.gif" alt="Enquirer Form Prompt" width="750">
</p>

**Related prompts**

- [Input](#input-prompt)
- [Survey](#survey-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

<br>
<br>

## Input Prompt

Prompt that takes user input and returns a string.

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/input-prompt.gif" alt="Enquirer Input Prompt" width="750">
</p>

**Example Usage**

```js
const question = {
  type: 'input',
  name: 'username',
  message: 'What is your username?'
};
```

**Related prompts**

- [Confirm](#confirm-prompt)
- [Numeral](#numeral-prompt)
- [Password](#password-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

<br>
<br>

## Invisible Prompt

Prompt that takes user input, hides it from the terminal, and returns a string.

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/invisible-prompt.gif" alt="Enquirer Invisible Prompt" width="750">
</p>

**Related prompts**

- [Password](#password-prompt)
- [Input](#input-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

<br>
<br>

## List Prompt

Prompt that returns a list of values, created by splitting the user input. The default split character is `,` with optional trailing whitespace.

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/list-prompt.gif" alt="Enquirer List Prompt" width="750">
</p>

**Related prompts**

- [Sort](#sort-prompt)
- [Select](#select-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

<br>
<br>

## MultiSelect Prompt

Prompt that allows the user to select multiple items from a list of options.

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/multiselect-prompt.gif" alt="Enquirer MultiSelect Prompt" width="750">
</p>

**Related prompts**

- [AutoComplete](#autocomplete-prompt)
- [Select](#select-prompt)
- [Survey](#survey-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

<br>
<br>

## Numeral Prompt

Prompt that takes a number as input.

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/numeral-prompt.gif" alt="Enquirer Numeral Prompt" width="750">
</p>

**Related prompts**

- [Input](#input-prompt)
- [Confirm](#confirm-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

<br>
<br>

## Password Prompt

Prompt that takes user input and masks it in the terminal. Also see the [invisible prompt](#invisible-prompt)

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/password-prompt.gif" alt="Enquirer Password Prompt" width="750">
</p>

**Related prompts**

- [Input](#input-prompt)
- [Invisible](#invisible-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

<br>
<br>

## Scale Prompt

A more compact version of the [Survey prompt](#survey-prompt), the Scale prompt allows the user to quickly provide feedback using a [Likert Scale](https://en.wikipedia.org/wiki/Likert_scale).

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/scale-prompt.gif" alt="Enquirer Scale Prompt" width="750">
</p>

**Related prompts**

- [AutoComplete](#autocomplete-prompt)
- [Select](#select-prompt)
- [Survey](#survey-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

<br>
<br>

## Select Prompt

Prompt that allows the user to select from a list of options.

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/select-prompt.gif" alt="Enquirer Select Prompt" width="750">
</p>

**Related prompts**

- [AutoComplete](#autocomplete-prompt)
- [MultiSelect](#multiselect-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

<br>
<br>

## Sort Prompt

Prompt that allows the user to sort items in a list.

**Example**

In this [example](https://github.com/enquirer/enquirer/raw/master/examples/sort/prompt.js), custom styling is applied to the returned values to make it easier to see what's happening.

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/sort-prompt.gif" alt="Enquirer Sort Prompt" width="750">
</p>

**Related prompts**

- [List](#list-prompt)
- [Select](#select-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

<br>
<br>

## Snippet Prompt

Prompt that allows the user to replace placeholders in a snippet of code or text.

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/snippet-prompt.gif" alt="Prompts" width="750">
</p>

**Related prompts**

- [Survey](#survey-prompt)
- [AutoComplete](#autocomplete-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

<br>
<br>

## Survey Prompt

Prompt that allows the user to provide feedback for a list of questions.

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/survey-prompt.gif" alt="Enquirer Survey Prompt" width="750">
</p>

**Related prompts**

- [Scale](#scale-prompt)
- [Snippet](#snippet-prompt)
- [Select](#select-prompt)

<br>
<br>

## Toggle Prompt

Prompt that allows the user to toggle between two values then returns `true` or `false`.

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/toggle-prompt.gif" alt="Enquirer Toggle Prompt" width="750">
</p>

As with the other prompts, all parts of this prompt are customizable. 

**Related prompts**

- [Confirm](#confirm-prompt)
- [Input](#input-prompt)
- [Sort](#sort-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

<br>
<br>

# ❯ Prompt Types

Enquirer 2.0 introduced the concept of prompt "types", with the goal of making custom prompts easier than ever to create and use. There are 4 (soon to be 5!) type classes:

* [ArrayPrompt](#arrayprompt)
* [BooleanPrompt](#booleanprompt)
* DatePrompt (Coming Soon!)
* [NumberPrompt](#numberprompt)
* [StringPrompt](#stringprompt)

Each type is a low-level class that may be used as a starting point for creating higher level prompts. Continue reading to learn how.

## ArrayPrompt

The `ArrayPrompt` class is used for creating prompts that display a list of choices in the terminal. For example, Enquirer uses this class as the basis for the [Select](#select) and [Survey](#survey) prompts.

### Options

In addition to the [options](#options) available to all prompts, Array prompts also support the following options.

| **Option**  | **Required?** | **Type**          | **Description**                                                                                                                                                                         |
| ----------- | ------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`      | `yes`         | `string|function` | Enquirer uses this value to determine the type of prompt to run, but it's optional when prompts are run directly.                                                                       |
| `name`      | `yes`         | `string|function` | Used as the key for the answer on the returned values (answers) object.                                                                                                                 |
| `message`   | `yes`         | `string|function` | The message to display when the prompt is rendered in the terminal.                                                                                                                     |
| `autofocus` | `no`          | `string|number`   | The index or name of the choice that should have focus when the prompt loads. Only one choice may have focus at a time.                                                                 |
| `initial`   | `no`          | `string|function` | The default value to return when the user does not supply a value.                                                                                                                      |
| `format`    | `no`          | `function`        | Function to format user input in the terminal.                                                                                                                                          |
| `result`    | `no`          | `function`        | Function to format the final submitted value before it's returned.                                                                                                                      |
| `stdin`     | `no`          | `stream`          | The input stream to use for emitting keypress events. Defaults to `process.stdin`.                                                                                                      |
| `stdout`    | `no`          | `stream`          | The output stream to use for writing the prompt to the terminal. Defaults to `process.stdout`.                                                                                          |
| `validate`  | `no`          | `function`        | Function to validate the submitted value before it's returned. This function may return a boolean or a string. If a string is returned it will be used as the validation error message. |

### Properties

Array prompts have the following instance properties and getters.

| **Property name** | **Type**                                                                          | **Description**                                                                                                                                                                                                                                                                                                                                    |
| ----------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `choices`         | `array`                                                                           | Array of choices that have been normalized from choices passed on the prompt options.                                                                                                                                                                                                                                                              |
| `cursor`          | `number`                                                                          | Position of the cursor relative to the _user input (string)_.                                                                                                                                                                                                                                                                                      |
| `enabled`         | `array`                                                                           | Returns an array of enabled choices.                                                                                                                                                                                                                                                                                                               |
| `focused`         | `array`                                                                           | Returns the currently selected choice in the visible list of choices. This is similar to the concept of focus in HTML and CSS. Focused choices are always visible (on-screen). When a list of choices is longer than the list of visible choices, and an off-screen choice is _focused_, the list will scroll to the focused choice and re-render. |
| `focused`         | Gets the currently selected choice. Equivalent to `prompt.choices[prompt.index]`. |
| `index`           | `number`                                                                          | Position of the pointer in the _visible list (array) of choices_.                                                                                                                                                                                                                                                                                  |
| `limit`           | `number`                                                                          | The number of choices to display on-screen.                                                                                                                                                                                                                                                                                                        |
| `selected`        | `array`                                                                           | Either a list of enabled choices (when `options.multiple` is true) or the currently focused choice.                                                                                                                                                                                                                                                |
| `visible`         | `string`                                                                          |                                                                                                                                                                                                                                                                                                                                                    |

### Methods

| **Method**    | **Description**                                                                                                                                                                                |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pointer()`   | Returns the visual symbol to use to identify the choice that currently has focus. The `❯` symbol is often used for this. The pointer is not always visible, as with the `autocomplete` prompt. |
| `indicator()` | Returns the visual symbol that indicates whether or not a choice is checked/enabled.                                                                                                           |
| `focus()`     | Sets focus on a choice, if it can be focused.                                                                                                                                                  |


### Choices

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

### Defining choices

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
```

Normalizes to the following when the prompt is run:

```js
const question = {
  name: 'fruit',
  message: 'Favorite fruit?'
  choices: [
    { name: 'Apple', message: 'Apple', value: 'Apple' },
    { name: 'Orange', message: 'Orange', value: 'Orange' },
    { name: 'Raspberry', message: 'Raspberry', value: 'Raspberry' }
  ]
};
```

### Choice properties

The following properties are supported on `choice` objects.

| **Option**  | **Type**          | **Description**                                                                                                                                                                                     |
| ----------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`      | `string`          | The unique key to identify a choice                                                                                                                                                                 |
| `message`   | `string`          | The message to display in the terminal. `name` is used when this is undefined.                                                                                                                      |
| `value`     | `string`          | Value to associate with the choice. Useful for creating key-value pairs from user choices. `name` is used when this is undefined.                                                                   |
| `choices`   | `array`           | Array of "child" choices.                                                                                                                                                                           |
| `hint`      | `string`          | Help message to display next to a choice.                                                                                                                                                           |
| `role`      | `string`          | Determines how the choice will be displayed. Currently the only role supported is `separator`. Additional roles may be added in the future (like `heading`, etc). Please create a [feature request] |
| `enabled`   | `boolean`         | Enabled a choice by default. This is only supported when `options.multiple` is true or on prompts that support multiple choices, like [MultiSelect](#-multiselect).                                 |
| `disabled`  | `boolean|string`  | Disable a choice so that it cannot be selected. This value may either be `true`, `false`, or a message to display.                                                                                  |
| `indicator` | `string|function` | Custom indicator to render for a choice (like a check or radio button).                                                                                                                             |


### Related prompts

- [AutoComplete](#autocomplete-prompt)
- [Form](#form-prompt)
- [MultiSelect](#multiselect-prompt)
- [Select](#select-prompt)
- [Survey](#survey-prompt)


## BooleanPrompt

The `BooleanPrompt` class is used for creating prompts that display and return a boolean value.

**Returns**: `boolean`

## NumberPrompt

The `NumberPrompt` class is used for creating prompts that display and return a numerical value.

**Returns**: `string|number` (number, or number formatted as a string)


## StringPrompt

The `StringPrompt` class is used for creating prompts that display and return a string value.

<br>

# ❯ Custom prompts
{%= format(include('docs/custom-prompts.md')) %}
