# Docs

- **Pluggable** - Use plugins to add advanced features, like [autofill][], [history][], and [debounce][]



## Performance

**Library** | **Load time**
--- | ---
[enquirer][] | `5.190ms`
[inquirer][] | `254.054ms`
[prompts][]  | `14.236ms`


## Instance Properties

- `prompt.input` - `process.stdin` by default, or `options.input`
- `prompt.output` - `process.stdout` by default, or `options.output`
- `prompt.rl` - readline interface, created with `prompt.input` and `prompt.output`.

## Events

- `state` emitted by `prompt` when a keypress event is emitted by the input stream
- `keypresss` emitted by `prompt` when a keypress event is emitted by the input stream


## Static properties and methods

### Prompts

All prompt classes are exposed as static methods on themselves so that inheriting classes can easily access that specific class and its properties, regardless of how many ancestors are in the prototype chain.

Example:

```js
class MultiSelect {
  static get MultiSelect() {
    return MultiSelect;
  }
}

class SomePrompt extends MultiSelect {}
class OtherPrompt extends SomePrompt {}

console.log(OtherPrompt.MultiSelect === MultiSelect); // true
```


## All properties

| **Name** | **Type** | **Description** | **Prompts** |
| --- | --- | --- | --- |
|  |  |  | |

## All options

| **Name** | **Type** | **Description** | **Prompts** |
| --- | --- | --- | --- |
|  |  |  |  |


## Events

| **Event name** | **Description** |
| --- | --- |
| `run`      | Emitted when the `.run()` method is called, after the [readline][] interface is created. |
| `keypress` |  |
| `state`    | Emitted at the same time as `keypress`, but emits the object returned from the [prompt.state()](#state) method. This object has useful state properties such as [status](#property-status) [cursor](#property-cursor) [value](#property-value) [typed](#property-typed) [error](#property-error) etc. |
| `submit`   |  |
| `abort`    | Emitted when an error occurs or when the user terminates the session early. |

**Example**

```js
const prompt = new Prompt({ name: 'username', message: 'What is your username?' });
const keypresses = [];
prompt.on('keypress', (s, key) => keypresses.push(key));

prompt.run()
  .then(() => console.log(keypresses))
  .catch(console.log);
```

## API

## Base types

- Array prompts
- Boolean prompts
- Number prompts
- String prompts
- ~~Date prompts~~


## Array prompts
## Boolean prompts
## Date prompts
## Number prompts
## String prompts

### Instance properties

- `prompt.cursor` - the position of the cursor in the `prompt.typed` string.

### Methods

***

## Question objects

Question are represented as `Question` objects that implement the following interface:

```js
interface Question {
  type: string;
  name: string;
  message: string;
}
```

### Question properties

- `type` **{string}** - A string representing the question type. This property is necessary for Enquirer to determine the type of prompt to run.
- `name` **{string}** - The name of the prompt, used as the key for the answer on the returned answers object.
- `message` **{string}** - The message to display when the prompt is rendered in the terminal.


***


```js
const question = {
  type: 'select',
  name: 'colors',
  message: 'Pick a color',
  initial: 1,
  choices: [
    { message: 'Red', value: '#ff0000' },
    { message: 'Green', value: '#00ff00' },
    { message: 'Blue', value: '#0000ff' }
  ]
};
```


### Choice object

```js
Choice {
  name: string;
  message: string | undefined;
  value: any | undefined;
  key: string | undefined;

  hint: string | undefined;
  disabled: boolean | undefined;
  selected: boolean | undefined;
}
```

| **Property**  | **Type**   | **Description**  |
| --- | --- | --- |
| `name`        | `string`   | The unique id for a choice |
| `message`     | `string`   | The message to display  |
| `value`       | `string`   | The value to return if the choice is selected |
| `alias`       | `string`   | Single character to use when keypress shortcuts are supported |
| `hint`        | `string`   |  |
| `error`       | `string`   |  |
| `disabled`    | `boolean`  |  |
| `separator`   | `boolean`  |  |
| `selected`    | `boolean`  |  |

**Aliases**

- `title` - alias for `message`
- `help` - alias for `help`
- `checked` - alias for `selected`


## options.header

Major positions

```
header
prefix message separator input suffix
body
footer
```

```
header
prefix message separator input suffix
- prefix message separator input suffix
- prefix message separator input suffix
- prefix message separator input suffix
- prefix message separator input suffix
footer
```

- `header`
- `prefix`
- `message`
- `separator`
- `input`
- `suffix`
- `footer`


## Examples

### Header

Disply a [header](#optionsheader) before your prompt.

```
     _-----_
    |       |    ╭──────────────────────────╮
    |--(o)--|    │   Welcome to my awesome  │
   `---------´   │        generator!        │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `

? Pick a color … (Use arrow keys, press <return> to submit)
❯ [x] Red
      Green
      Blue
(Move up and down to reveal more choices)
```



```
     _-----_
    |       |    ╭──────────────────────────╮
    |--(o)--|    │   Welcome to my awesome  │
   `---------´   │        generator!        │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `

? Pick a color … Something typed (Use arrow keys, press <return> to submit)
❯ Red (this is a an error!)
  Green (this is a hint!)
  Blue
(Move up and down to reveal more choices)
```




### Cut/paste

| **command** | **description** |
| --- | --- |
| <kbd>ctrl</kbd>+<kbd>_</kbd> | Undo |
| <kbd>ctrl</kbd>+<kbd>c</kbd> | Cancel the current command |
| <kbd>ctrl</kbd>+<kbd>k</kbd> | Cut everything after the cursor position |
| <kbd>ctrl</kbd>+<kbd>w</kbd> | Cut a word to the left of the cursor position |
| <kbd>ctrl</kbd>+<kbd>y</kbd> | Paste the last deleted command |
| <kbd>ctrl</kbd>+<kbd>d</kbd> | Clear one character to the right of the cursor position |
| <kbd>ctrl</kbd>+<kbd>l</kbd> | Clear the entire terminal |
| <kbd>ctrl</kbd>+<kbd>u</kbd> | Clear the current line |
| <kbd>ctrl</kbd>+<kbd>x</kbd> | Toggle between first and cursor position |

**Windows**

| **command** | **description** |
| --- | --- |
| <kbd>alt</kbd>+<kbd><</kbd> | Cut a word to the left of the cursor |
| <kbd>alt</kbd>+<kbd>d</kbd> | Cut a word to the right of the cursor |

### Search/history

| **command** | **description** |
| --- | --- |
| <kbd>ctrl</kbd>+<kbd>r</kbd> | Search for a command in history (type a search term) |
| <kbd>ctrl</kbd>+<kbd>g</kbd> | Cancel the search and restore original line |
| <kbd>ctrl</kbd>+<kbd>j</kbd> | End the search at current history entry |
| <kbd>ctrl</kbd>+<kbd>n</kbd> | Get next command from history |
| <kbd>ctrl</kbd>+<kbd>▼</kbd> | Get next command from history |
| <kbd>ctrl</kbd>+<kbd>p</kbd> | Get previous command from history |
| <kbd>ctrl</kbd>+<kbd>▲</kbd> | Get previous command from history |
