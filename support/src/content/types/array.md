# Array Prompt

The `ArrayPrompt` class is used for creating prompts that display an array of choices in the terminal, and return one more more value.

## Keypresses

Array prompts support the following keypress combinations.

| **Keypress** | **Action** | **Description** |
| --- | --- | --- |
| <kbd>shift</kbd>+<kbd>▲</kbd> | `shiftUp` | `undefined` | todo |
| <kbd>shift</kbd>+<kbd>▼</kbd> | `shiftDown` | `undefined` | todo |
| <kbd>fn</kbd>+<kbd>▲</kbd> (mac) or <kbd>Page Up</kbd> (win) | `pageUp` | `undefined` | todo |
| <kbd>fn</kbd>+<kbd>▼</kbd> (mac) or <kbd>Page Down</kbd> (win) | `pageDown` | `undefined` | todo |


## Options

Array prompts take the following options.

| **Name** | **Type** |  **Default** | **Description** |
| --- | --- | --- | --- |
| `limit` | `Number` | `options.choices.length` | The number of choices to make visible in the terminal. Users can scroll up and down to reveal more choices when the entire list is not shown. |
| `initial` | `Number|String|Array` | `undefined` | The index or name of the initial choice to enable. |
| `hint` | `String` | `undefined` | todo |
| `name` | `String` | `undefined` | todo |
| `type` | `String` | `undefined` | todo |
| `messsage` | `String` | `undefined` | todo |
| `choices` | `Array` | `undefined` | todo |


## Options examples

**Type**: `number`

**Default**: `options.choices.length`

**Description**: The number of choices to make visible in the terminal. Users can scroll up and down to reveal more choices when the entire list is not shown.

### options.limit example

The following prompt would only render three choices in the terminal at any given time.

```js
const prompt = new Prompt({
  name: 'alphabet',
  message: 'Choose some letters',
  choices: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  limit: 3
});
```


### Instance properties

- `prompt.choices` - Normalized array of choices created from `options.choices`.
- `prompt.list` - Visible list of choices, if `options.limit` is defined, or the entire choices array.
- `prompt.cursor` - the position of the cursor in the visible `prompt.list` array

### Related

- [prompt-autocompletion][]
- [prompt-select][]
- [prompt-multiselect][]
- [prompt-checkbox][]
- [prompt-radio][]
