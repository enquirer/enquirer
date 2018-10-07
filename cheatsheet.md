# Enquirer Cheatsheet

- [Terminology](#terminology)
- [Keypresses](#keypresses)
- [Properties](#properties)
- [Methods](#methods)
- [Options](#options)

## Terminology

Whenever possible, we attempted to use familiar concepts and terminology from HTML/CSS to describe prompt behavior and attributes. 

| **term** | **description** |
| --- | --- |
| `focused` | The currently targeted choice in a _visible_ list of choices. Similar in concept to focus in HTML and CSS. |
| `pointer` | Marks the choice that currently has focus. The `❯` symbol is often used for this, but the pointer is not always visible, as with the `autocomplete` prompt. |
| `indicator` | Designates whether or not a choice is checked/enabled.  |
| `index` | The zero-based position of the pointer in the visible list of choices.  |
| `cursor` | The zero-based position of the cursor relative to user input. |
| `selected` | The position of the currently choice. |
| `enabled` | The position of the currently choice. |
| `active` | The position of the currently choice. |


## Methods

| **term** | **description** |
| --- | --- |
| `focus` | Sets the focus on the specified choice, if it can be focused. |


## Getters

| **term** | **description** |
| --- | --- |
| `prompt.focused` | Gets the currently selected choice. Equivalent to `prompt.choices[prompt.index]`. |


## Options

| **name** | **type** | **default** | **description** |
| --- | --- |
| `autofocus` | `string|number` | `undefined` | The index or name of the choice that should have focus when the prompt loads. Only one choice may have focus at a time. |


## Styles

Styles are the semantic colors that are applied to the different parts of a prompt. 

### Available styles

The [ansi-colors][] library is used to apply styling. 

| **Name** | **Default colors** | **Description** |
| --- | --- | --- |
| `primary`  | `cyan`     | Used on the prompt [indicator](#indicator), choice [pointers](#pointer), and user input after submitted. |
| `danger`   | `red`      | Used on error messages. |
| `strong`   | `bold`     | Used on the user-defined [prompt message](#message). |
| `success`  | `green`    | Used on  |
| `warning`  | `yellow`   |  |
| `muted`    | `dim`      |  |
| `disabled` | `gray`     |  |
| `dark`     | `dim.gray` |  |

- [foo] [bar](#baz)
- [foo] [bar](#baz)

  get info() {
    return this.primary;
  },
  get inverse() {
    return this.opposite(this.primary);
  },
  get complement() {
    return this.complementary(this.primary);
  },

  /**
   * Prompt Statuses
   */

  get pending() {
    return this.default;
  },
  get completing() {
    return this.pending;
  },
  get cancelled() {
    return this.default;
  },
  get answered() {
    return this.primary;
  },

  /**
   * Choice statuses
   */

  get on() {
    return this.success;
  },
  get off() {
    return this.dark;
  },

  get active() {
    return this.primary;
  },
  get selected() {
    return this.active.underline;
  },


  /**
   * User input styling
   */

  get placeholder() {
    return this.primary.dim;
  },
  get highlight() {
    return this.inverse;
  }

  default: colors.none,
  opposite: utils.inverse,
  complementary: utils.complement,


### Using styles

If you are a prompt author, styles may be accessed inside a prompt instance on the `this.styles` object, where each "style" is a function that wraps the returned string in ANSI codes. 

| **Name** | **Description** |
| --- | --- |
| Pointer | Signifies the cursor position |
| Indicator | Status indicator |


## Keypresses

### Array prompts

| **command** | **description** |
| --- | --- |
| <kbd>space</kbd> | Toggle the currently selected choice when `options.multiple` is true. |
| <kbd>number</kbd> | Select the choice at the given index. When `options.multiple` is not true, number keys also _enable_ the choice. |
| <kbd>left</kbd> | Move the cursor to the left, when user input is supported. |
| <kbd>right</kbd> | Move the cursor to the right, when user input is supported. |
| <kbd>up</kbd> | Move the index position up one. |
| <kbd>down</kbd> | Moves the cursor to the right, when user input is supported. |
| <kbd>a</kbd> | Toggle all choices to be enabled or disabled. |
| <kbd>i</kbd> | Invert the current selection of choices. |
| <kbd>g</kbd> | Toggle the current choice group. |

### Move cursor

| **command** | **description** |
| --- | --- |
| <kbd>ctrl</kbd>+<kbd>a</kbd> | Move cursor to the start of the line |
| <kbd>ctrl</kbd>+<kbd>e</kbd> | Move cursor to the end of the line |
| <kbd>ctrl</kbd>+<kbd>b</kbd> | Move cursor back one character |
| <kbd>ctrl</kbd>+<kbd>f</kbd> | Move cursor forward one character |

**Windows**

| **command** | **description** |
| --- | --- |
| <kbd>alt</kbd>+<kbd>b</kbd> | Move cursor back one word |
| <kbd>alt</kbd>+<kbd>f</kbd> | Move cursor forward one word |

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
| <kbd>ctrl</kbd>+<kbd>xx</kbd> | Toggle between first and cursor position |

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