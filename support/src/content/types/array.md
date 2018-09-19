# Array Prompt

The `ArrayPrompt` class is used for creating prompts that display an array of choices in the terminal, and return one more more value.

/**
 * - cursor - position of cursor in a typed value
 * - index - position of currently selected item in an array of items
 *
 * Tips:
 * - cursor and typed value only change from append and delete
 */

## Keypresses

Array prompts support the following keypress combinations.

| **Keypress** | **Action** | **Description** |
| --- | --- | --- |
| <kbd>shift</kbd>+<kbd>▲</kbd> | `shiftUp` | `undefined` | todo |
| <kbd>shift</kbd>+<kbd>▼</kbd> | `shiftDown` | `undefined` | todo |
| <kbd>fn</kbd>+<kbd>▲</kbd> (mac) or <kbd>Page Up</kbd> (win) | `pageUp` | `undefined` | todo |
| <kbd>fn</kbd>+<kbd>▼</kbd> (mac) or <kbd>Page Down</kbd> (win) | `pageDown` | `undefined` | todo |


### Prompt instance properties

- `prompt.choices` - Normalized array of choices created from `options.choices`.
- `prompt.visible` - Visible list of choices, if `options.limit` is defined, or the entire choices array.
- `prompt.index` - The index of the choice that currently has focus.
- `prompt.focused` - The choice that has focus.


## Examples

### options.limit

The following prompt would only render three choices in the terminal at any given time.

```js
const prompt = new Prompt({
  name: 'alphabet',
  message: 'Choose some letters',
  choices: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  limit: 3
});
```

### Related prompts

- [prompt-autocompletion][]
- [prompt-select][]
- [prompt-multiselect][]
- [prompt-checkbox][]
- [prompt-radio][]
