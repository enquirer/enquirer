# Enquirer's Prompts

This section is about Enquirer's prompts: what they look like, how they work, how to run them, available options, and how to customize the prompts or create your own prompt concept.

**Getting started with Enquirer's prompts**

- [Prompt](#prompt) - The base `Prompt` class used by other prompts
  - [Prompt Options](#prompt-options)
- [Built-in prompts](#built-in-prompts)
- [Prompt Types](#prompt-types) - The base `Prompt` class used by other prompts 
- [Custom prompts](#%E2%9D%AF-custom-prompts) - Enquirer 2.0 introduced the concept of prompt "types", with the goal of making custom prompts easier than ever to create and use.


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
Each property of the options object is described below:

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

- [AutoComplete Prompt](#autocomplete-prompt)
- [BasicAuth Prompt](#basicauth-prompt)
- [Confirm Prompt](#confirm-prompt)
- [Form Prompt](#form-prompt)
- [Input Prompt](#input-prompt)
- [Invisible Prompt](#invisible-prompt)
- [List Prompt](#list-prompt)
- [MultiSelect Prompt](#multiselect-prompt)
- [Numeral Prompt](#numeral-prompt)
- [Password Prompt](#password-prompt)
- [Quiz Prompt](#quiz-prompt)
- [Survey Prompt](#survey-prompt)
- [Scale Prompt](#scale-prompt)
- [Select Prompt](#select-prompt)
- [Sort Prompt](#sort-prompt)
- [Snippet Prompt](#snippet-prompt)
- [Toggle Prompt](#toggle-prompt)

## AutoComplete Prompt

Prompt that auto-completes as the user types, and returns the selected value as a string.

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/autocomplete-prompt.gif" alt="Enquirer AutoComplete Prompt" width="750">
</p>

**Example Usage**

```js
const { AutoComplete } = require('enquirer');

const prompt = new AutoComplete({
  name: 'flavor',
  message: 'Pick your favorite flavor',
  limit: 10,
  choices: [
    'Almond',
    'Apple',
    'Banana',
    'Blackberry',
    'Blueberry',
    'Cherry',
    'Chocolate',
    'Cinnamon',
    'Coconut',
    'Cranberry',
    'Grape',
    'Nougat',
    'Orange',
    'Pear',
    'Pineapple',
    'Raspberry',
    'Strawberry',
    'Vanilla',
    'Watermelon',
    'Wintergreen'
  ]
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
```

**AutoComplete Options**

| Option      | Type       | Default                                                             | Description                                                                                                  |
| ----------- | ---------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `highlight` | `function` | `dim` version of primary style                                      | The color to use when "highlighting" characters in the list that match user input.                           |
| `multiple`  | `boolean`  | `false`                                                             | Allow multiple choices to be selected.                                                                       |
| `suggest`   | `function` | Greedy match, returns true if choice message contains input string. | Function that filters choices. Takes user input and a choices array, and returns a list of matching choices. |
| `footer`   | `function` | None | Function that displays [footer text](https://github.com/enquirer/enquirer/blob/6c2819518a1e2ed284242a99a685655fbaabfa28/examples/autocomplete/option-footer.js#L10) |

**Related prompts**

- [Select](#select-prompt)
- [MultiSelect](#multiselect-prompt)
- [Survey](#survey-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

***

## BasicAuth Prompt

Prompt that asks for username and password to authenticate the user. The default implementation of `authenticate` function in `BasicAuth` prompt is to compare the username and password with the values supplied while running the prompt. The implementer is expected to override the `authenticate` function with a custom logic such as making an API request to a server to authenticate the username and password entered and expect a token back.

<p align="center">
  <img src="https://user-images.githubusercontent.com/13731210/61570485-7ffd9c00-aaaa-11e9-857a-d47dc7008284.gif" alt="Enquirer BasicAuth Prompt" width="750">
</p>

**Example Usage**

```js
const { BasicAuth } = require('enquirer');

 const prompt = new BasicAuth({
  name: 'password',
  message: 'Please enter your password',
  username: 'rajat-sr',
  password: '123',
  showPassword: true
});

 prompt
  .run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
```

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

***

## Confirm Prompt

Prompt that returns `true` or `false`.

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/confirm-prompt.gif" alt="Enquirer Confirm Prompt" width="750">
</p>

**Example Usage**

```js
const { Confirm } = require('enquirer');

const prompt = new Confirm({
  name: 'question',
  message: 'Want to answer?'
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
```

**Related prompts**

- [Input](#input-prompt)
- [Numeral](#numeral-prompt)
- [Password](#password-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

***

## Form Prompt

Prompt that allows the user to enter and submit multiple values on a single terminal screen.

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/form-prompt.gif" alt="Enquirer Form Prompt" width="750">
</p>

**Example Usage**

```js
const { Form } = require('enquirer');

const prompt = new Form({
  name: 'user',
  message: 'Please provide the following information:',
  choices: [
    { name: 'firstname', message: 'First Name', initial: 'Jon' },
    { name: 'lastname', message: 'Last Name', initial: 'Schlinkert' },
    { name: 'username', message: 'GitHub username', initial: 'jonschlinkert' }
  ]
});

prompt.run()
  .then(value => console.log('Answer:', value))
  .catch(console.error);
```

**Related prompts**

- [Input](#input-prompt)
- [Survey](#survey-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

***

## Input Prompt

Prompt that takes user input and returns a string.

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/input-prompt.gif" alt="Enquirer Input Prompt" width="750">
</p>

**Example Usage**

```js
const { Input } = require('enquirer');
const prompt = new Input({
  message: 'What is your username?',
  initial: 'jonschlinkert'
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.log);
```

You can use [data-store](https://github.com/jonschlinkert/data-store) to store [input history](https://github.com/enquirer/enquirer/blob/master/examples/input/option-history.js) that the user can cycle through (see [source](https://github.com/enquirer/enquirer/blob/8407dc3579123df5e6e20215078e33bb605b0c37/lib/prompts/input.js)).

**Related prompts**

- [Confirm](#confirm-prompt)
- [Numeral](#numeral-prompt)
- [Password](#password-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

***

## Invisible Prompt

Prompt that takes user input, hides it from the terminal, and returns a string.

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/invisible-prompt.gif" alt="Enquirer Invisible Prompt" width="750">
</p>

**Example Usage**

```js
const { Invisible } = require('enquirer');
const prompt = new Invisible({
  name: 'secret',
  message: 'What is your secret?'
});

prompt.run()
  .then(answer => console.log('Answer:', { secret: answer }))
  .catch(console.error);
```

**Related prompts**

- [Password](#password-prompt)
- [Input](#input-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

***

## List Prompt

Prompt that returns a list of values, created by splitting the user input. The default split character is `,` with optional trailing whitespace.

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/list-prompt.gif" alt="Enquirer List Prompt" width="750">
</p>

**Example Usage**

```js
const { List } = require('enquirer');
const prompt = new List({
  name: 'keywords',
  message: 'Type comma-separated keywords'
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
```

**Related prompts**

- [Sort](#sort-prompt)
- [Select](#select-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

***

## MultiSelect Prompt

Prompt that allows the user to select multiple items from a list of options.

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/multiselect-prompt.gif" alt="Enquirer MultiSelect Prompt" width="750">
</p>

**Example Usage**

```js
const { MultiSelect } = require('enquirer');

const prompt = new MultiSelect({
  name: 'value',
  message: 'Pick your favorite colors',
  limit: 7,
  choices: [
    { name: 'aqua', value: '#00ffff' },
    { name: 'black', value: '#000000' },
    { name: 'blue', value: '#0000ff' },
    { name: 'fuchsia', value: '#ff00ff' },
    { name: 'gray', value: '#808080' },
    { name: 'green', value: '#008000' },
    { name: 'lime', value: '#00ff00' },
    { name: 'maroon', value: '#800000' },
    { name: 'navy', value: '#000080' },
    { name: 'olive', value: '#808000' },
    { name: 'purple', value: '#800080' },
    { name: 'red', value: '#ff0000' },
    { name: 'silver', value: '#c0c0c0' },
    { name: 'teal', value: '#008080' },
    { name: 'white', value: '#ffffff' },
    { name: 'yellow', value: '#ffff00' }
  ]
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
```

**Related prompts**

- [AutoComplete](#autocomplete-prompt)
- [Select](#select-prompt)
- [Survey](#survey-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

***

## Numeral Prompt

Prompt that takes a number as input.

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/numeral-prompt.gif" alt="Enquirer Numeral Prompt" width="750">
</p>

**Example Usage**

```js
const { NumberPrompt } = require('enquirer');

const prompt = new NumberPrompt({
  name: 'number',
  message: 'Please enter a number'
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
```

**Related prompts**

- [Input](#input-prompt)
- [Confirm](#confirm-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

***

## Password Prompt

Prompt that takes user input and masks it in the terminal. Also see the [invisible prompt](#invisible-prompt)

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/password-prompt.gif" alt="Enquirer Password Prompt" width="750">
</p>

**Example Usage**

```js
const { Password } = require('enquirer');

const prompt = new Password({
  name: 'password',
  message: 'What is your password?'
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
```

**Related prompts**

- [Input](#input-prompt)
- [Invisible](#invisible-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

***

## Quiz Prompt

Prompt that allows the user to play multiple-choice quiz questions.

<p align="center">
  <img src="https://user-images.githubusercontent.com/13731210/61567561-891d4780-aa6f-11e9-9b09-3d504abd24ed.gif" alt="Enquirer Quiz Prompt" width="750">
</p>

**Example Usage**

```js
const { Quiz } = require('enquirer');

 const prompt = new Quiz({
  name: 'countries',
  message: 'How many countries are there in the world?',
  choices: ['165', '175', '185', '195', '205'],
  correctChoice: 3
});

 prompt
  .run()
  .then(answer => {
    if (answer.correct) {
      console.log('Correct!');
    } else {
      console.log(`Wrong! Correct answer is ${answer.correctAnswer}`);
    }
  })
  .catch(console.error);
```

**Quiz Options**

| Option         | Type        | Required    | Description                                                                                                  |
| -----------    | ----------  | ----------  | ------------------------------------------------------------------------------------------------------------ |
| `choices`      | `array`     | Yes         | The list of possible answers to the quiz question.                                                           |
| `correctChoice`| `number`    | Yes         | Index of the correct choice from the `choices` array.                                                        |

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

***

## Survey Prompt

Prompt that allows the user to provide feedback for a list of questions.

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/survey-prompt.gif" alt="Enquirer Survey Prompt" width="750">
</p>

**Example Usage**

```js
const { Survey } = require('enquirer');

const prompt = new Survey({
  name: 'experience',
  message: 'Please rate your experience',
   scale: [
    { name: '1', message: 'Strongly Disagree' },
    { name: '2', message: 'Disagree' },
    { name: '3', message: 'Neutral' },
    { name: '4', message: 'Agree' },
    { name: '5', message: 'Strongly Agree' }
  ],
  margin: [0, 0, 2, 1],
  choices: [
    {
      name: 'interface',
      message: 'The website has a friendly interface.'
    },
    {
      name: 'navigation',
      message: 'The website is easy to navigate.'
    },
    {
      name: 'images',
      message: 'The website usually has good images.'
    },
    {
      name: 'upload',
      message: 'The website makes it easy to upload images.'
    },
    {
      name: 'colors',
      message: 'The website has a pleasing color palette.'
    }
  ]
});

prompt.run()
  .then(value => console.log('ANSWERS:', value))
  .catch(console.error);
```

**Related prompts**

- [Scale](#scale-prompt)
- [Snippet](#snippet-prompt)
- [Select](#select-prompt)

***

## Scale Prompt

A more compact version of the [Survey prompt](#survey-prompt), the Scale prompt allows the user to quickly provide feedback using a [Likert Scale](https://en.wikipedia.org/wiki/Likert_scale).

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/scale-prompt.gif" alt="Enquirer Scale Prompt" width="750">
</p>

**Example Usage**

```js
const { Scale } = require('enquirer');
const prompt = new Scale({
  name: 'experience',
  message: 'Please rate your experience',
  scale: [
    { name: '1', message: 'Strongly Disagree' },
    { name: '2', message: 'Disagree' },
    { name: '3', message: 'Neutral' },
    { name: '4', message: 'Agree' },
    { name: '5', message: 'Strongly Agree' }
  ],
  margin: [0, 0, 2, 1],
  choices: [
    {
      name: 'interface',
      message: 'The website has a friendly interface.',
      initial: 2
    },
    {
      name: 'navigation',
      message: 'The website is easy to navigate.',
      initial: 2
    },
    {
      name: 'images',
      message: 'The website usually has good images.',
      initial: 2
    },
    {
      name: 'upload',
      message: 'The website makes it easy to upload images.',
      initial: 2
    },
    {
      name: 'colors',
      message: 'The website has a pleasing color palette.',
      initial: 2
    }
  ]
});

prompt.run()
  .then(value => console.log('ANSWERS:', value))
  .catch(console.error);
```

**Related prompts**

- [AutoComplete](#autocomplete-prompt)
- [Select](#select-prompt)
- [Survey](#survey-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

***

## Select Prompt

Prompt that allows the user to select from a list of options.

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/select-prompt.gif" alt="Enquirer Select Prompt" width="750">
</p>

**Example Usage**

```js
const { Select } = require('enquirer');

const prompt = new Select({
  name: 'color',
  message: 'Pick a flavor',
  choices: ['apple', 'grape', 'watermelon', 'cherry', 'orange']
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
```

**Related prompts**

- [AutoComplete](#autocomplete-prompt)
- [MultiSelect](#multiselect-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

***

## Sort Prompt

Prompt that allows the user to sort items in a list.

**Example**

In this [example](https://github.com/enquirer/enquirer/raw/master/examples/sort/prompt.js), custom styling is applied to the returned values to make it easier to see what's happening.

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/sort-prompt.gif" alt="Enquirer Sort Prompt" width="750">
</p>

**Example Usage**

```js
const colors = require('ansi-colors');
const { Sort } = require('enquirer');
const prompt = new Sort({
  name: 'colors',
  message: 'Sort the colors in order of preference',
  hint: 'Top is best, bottom is worst',
  numbered: true,
  choices: ['red', 'white', 'green', 'cyan', 'yellow'].map(n => ({
    name: n,
    message: colors[n](n)
  }))
});

prompt.run()
  .then(function(answer = []) {
    console.log(answer);
    console.log('Your preferred order of colors is:');
    console.log(answer.map(key => colors[key](key)).join('\n'));
  })
  .catch(console.error);
```

**Related prompts**

- [List](#list-prompt)
- [Select](#select-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

***

## Snippet Prompt

Prompt that allows the user to replace placeholders in a snippet of code or text.

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/snippet-prompt.gif" alt="Prompts" width="750">
</p>

**Example Usage**

```js
const semver = require('semver');
const { Snippet } = require('enquirer');
const prompt = new Snippet({
  name: 'username',
  message: 'Fill out the fields in package.json',
  required: true,
  fields: [
    {
      name: 'author_name',
      message: 'Author Name'
    },
    {
      name: 'version',
      validate(value, state, item, index) {
        if (item && item.name === 'version' && !semver.valid(value)) {
          return prompt.styles.danger('version should be a valid semver value');
        }
        return true;
      }
    }
  ],
  template: `{
  "name": "\${name}",
  "description": "\${description}",
  "version": "\${version}",
  "homepage": "https://github.com/\${username}/\${name}",
  "author": "\${author_name} (https://github.com/\${username})",
  "repository": "\${username}/\${name}",
  "license": "\${license:ISC}"
}
`
});

prompt.run()
  .then(answer => console.log('Answer:', answer.result))
  .catch(console.error);
```

**Related prompts**

- [Survey](#survey-prompt)
- [AutoComplete](#autocomplete-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

***

## Toggle Prompt

Prompt that allows the user to toggle between two values then returns `true` or `false`.

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/toggle-prompt.gif" alt="Enquirer Toggle Prompt" width="750">
</p>

**Example Usage**

```js
const { Toggle } = require('enquirer');

const prompt = new Toggle({
  message: 'Want to answer?',
  enabled: 'Yep',
  disabled: 'Nope'
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
```

**Related prompts**

- [Confirm](#confirm-prompt)
- [Input](#input-prompt)
- [Sort](#sort-prompt)

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

***

## Prompt Types
There are 5 (soon to be 6!) type classes:
* [ArrayPrompt](#arrayprompt)
    - [Options](#options)
    - [Properties](#properties)
    - [Methods](#methods)
    - [Choices](#choices)
    - [Defining choices](#defining-choices)
    - [Choice properties](#choice-properties)
    - [Related prompts](#related-prompts)
* [AuthPrompt](#authprompt)
* [BooleanPrompt](#booleanprompt)
* DatePrompt (Coming Soon!)
* [NumberPrompt](#numberprompt)
* [StringPrompt](#stringprompt)

Each type is a low-level class that may be used as a starting point for creating higher level prompts. Continue reading to learn how.

## ArrayPrompt

The `ArrayPrompt` class is used for creating prompts that display a list of choices in the terminal. For example, Enquirer uses this class as the basis for the [Select](#select) and [Survey](#survey) prompts.

### Options

In addition to the [options](#options) available to all prompts, Array prompts also support the following options.

| **Option**  | **Required?** | **Type**        | **Description**                                                                                                         |
| ----------- | ------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `autofocus` | `no`          | `string|number` | The index or name of the choice that should have focus when the prompt loads. Only one choice may have focus at a time. |  |
| `stdin`     | `no`          | `stream`        | The input stream to use for emitting keypress events. Defaults to `process.stdin`.                                      |
| `stdout`    | `no`          | `stream`        | The output stream to use for writing the prompt to the terminal. Defaults to `process.stdout`.                          |
|             |

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

***

## AuthPrompt

The `AuthPrompt` is used to create prompts to log in user using any authentication method. For example, Enquirer uses this class as the basis for the [BasicAuth Prompt](#basicauth-prompt). You can also find prompt examples in `examples/auth/` folder that utilizes `AuthPrompt` to create OAuth based authentication prompt or a prompt that authenticates using time-based OTP, among others.

`AuthPrompt` has a factory function that creates an instance of `AuthPrompt` class and it expects an `authenticate` function, as an argument, which overrides the `authenticate` function of the `AuthPrompt` class.

### Methods

| **Method**         | **Description**                                                                                                                                                                                          |
| -------------      | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `authenticate()`   | Contain all the authentication logic. This function should be overridden to implement custom authentication logic. The default `authenticate` function throws an error if no other function is provided. |

### Choices

Auth prompt supports the `choices` option, which is the similar to the choices used in [Form Prompt](#form-prompt).

**Example**

```js
const { AuthPrompt } = require('enquirer');

function authenticate(value, state) {
  if (value.username === this.options.username && value.password === this.options.password) {
    return true;
  }
  return false;
}

const CustomAuthPrompt = AuthPrompt.create(authenticate);

const prompt = new CustomAuthPrompt({
  name: 'password',
  message: 'Please enter your password',
  username: 'rajat-sr',
  password: '1234567',
  choices: [
    { name: 'username', message: 'username' },
    { name: 'password', message: 'password' }
  ]
});

prompt
  .run()
  .then(answer => console.log('Authenticated?', answer))
  .catch(console.error);
```

### Related prompts

- [BasicAuth Prompt](#basicauth-prompt)

***

## BooleanPrompt

The `BooleanPrompt` class is used for creating prompts that display and return a boolean value.

**Returns**: `boolean`

*** 

## NumberPrompt

The `NumberPrompt` class is used for creating prompts that display and return a numerical value.

**Returns**: `string|number` (number, or number formatted as a string)

*** 

## StringPrompt

The `StringPrompt` class is used for creating prompts that display and return a string value.

<br>

# ❯ Custom prompts
{%= format(include('docs/custom-prompts.md')) %}
