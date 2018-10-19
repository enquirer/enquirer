# Enquirer Cheatsheet

- [Terminology](#terminology)

**API**

- [Keypresses](#keypresses)
- [Properties](#properties)
- [Methods](#methods)
- [Options](#options)
- [State](#state)
- [Status](#status)
- [Events](#events)

**State and Status**

- [state](#state) -  The `state` contains the necessary properties for rendering each part of a prompt in the terminal.
- [status](#status) - A prompt's status is either `pending`, `answered`, or `cancelled`.

**Styling**

- [Styles](#styles) - Styles are the semantic colors used consistently throughout the prompts.
- [Symbols](#symbols) - Unicode symbols
- [Elements](#elements) - Elements combine styles, unicode symbols, and text for the various parts of a prompt.
- [Transforms](#transforms) - Transforms are responsible for formatting user input based on prompt state and status.
- [Themes](#themes)

## ❯ Elements

An element is a functions that is responsible for combining the styles, text and unicode symbols to display for a specific part of prompt, based on prompt's [state](#state) and [status](#status).

prefix
message
separator
indicator


## ❯ Transforms

objects that consist of a `render` function and a `result` function. based on the state and status of the prompt.

## ❯ Terminology

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
| `element` | Elements are the various parts of a prompt. An element may consist of styles, text and unicode symbols. |

## ❯ Keypresses

| **command** | **description** |
| --- | --- |
| <kbd>ctrl</kbd>+<kbd>a</kdb> | Move the cursor to the first character in user input. |

| <kbd>ctrl</kbd>+<kbd>c</kbd> | Cancel the prompt. |
| <kbd>ctrl</kbd>+<kbd>d</kbd> | Cancel the prompt. |
| <kbd>ctrl</kbd>+<kbd>g</kdb> | Reset the prompt to its initial state. |
| <kbd>ctrl</kbd>+<kbd>l</kdb> | Reset the prompt to its initial state. |
| <kbd>ctrl</kbd>+<kbd>r</kdb> | Remove the current value from prompt history (when supported). |
| <kbd>ctrl</kbd>+<kbd>s</kdb> | Save the current value to prompt history (when supported). |
| <kbd>ctrl</kbd>+<kbd>z</kdb> | Undo the previous action (when supported). |

### Move Cursor

The following keypresses may be used on any prompts that support user input.

| **command** | **description** |
| --- | --- |
| <kbd>ctrl</kbd>+<kbd>a</kbd> | Move cursor to the start of the line |
| <kbd>ctrl</kbd>+<kbd>e</kbd> | Move cursor to the end of the line |
| <kbd>ctrl</kbd>+<kbd>b</kbd> | Move cursor back one character |
| <kbd>ctrl</kbd>+<kbd>f</kbd> | Move cursor forward one character |
| <kbd>ctrl</kbd>+<kbd>x</kbd> | Toggle between first and cursor position |
| <kbd>left</kbd> | Move the cursor forward one character. |
| <kbd>right</kbd> | Move the cursor back one character. |

**Windows**

_Not implemented yet_

| **command** | **description** |
| --- | --- |
| <kbd>alt</kbd>+<kbd>b</kbd> | Move cursor back one word |
| <kbd>alt</kbd>+<kbd>f</kbd> | Move cursor forward one word |

## ❯ Array prompt keypresses

| **command** | **description** |
| --- | --- |
| <kbd>a</kbd> | Toggle all choices to be enabled or disabled. |
| <kbd>i</kbd> | Invert the current selection of choices. |
| <kbd>g</kbd> | Toggle the current choice group. |
| <kbd>space</kbd> | Toggle the currently selected choice when `options.multiple` is true. |

### Hide/show Choices

| <kbd>fn</kbd>+<kbd>up</kbd> | Decrease the number of visible choices by one. |
| <kbd>fn</kbd>+<kbd>down</kbd> | Increase the number of visible choices by one. |

### Move Pointer

| **command** | **description** |
| --- | --- |
| <kbd>number</kbd> | Move the pointer to the choice at the given index. Also toggles the selected choice when `options.multiple` is true. |
| <kbd>up</kbd> | Move the pointer up. |
| <kbd>down</kbd> | Move the pointer down. |
| <kbd>ctrl</kbd>+<kbd>a</kbd> | Move the pointer to the first _visible_ choice. |
| <kbd>ctrl</kbd>+<kbd>e</kbd> | Move the pointer to the last _visible_ choice. |
| (mac) <kbd>fn</kbd>+<kbd>left</kbd> / (win) <kbd>home</kbd> | Move the pointer to the first choice in the choices array. |
| (mac) <kbd>fn</kbd>+<kbd>right</kbd> / (win) <kbd>end</kbd> | Move the pointer to the last choice in the choices array. |
| <kbd>shift</kbd>+<kbd>up</kbd> | Scroll up one choice without changing pointer position. |
| <kbd>shift</kbd>+<kbd>down</kbd> | Scroll down one choice without changing pointer position. |

<br>
<hr>
<br>

## ❯ Properties

### Getters

| **term** | **description** |
| --- | --- |
| `prompt.focused` | Gets the currently selected choice. Equivalent to `prompt.choices[prompt.index]`. |

<br>
<hr>
<br>


## ❯ Methods

| **term** | **description** |
| --- | --- |
| `focus` | Sets focus on the specified choice, if it can be focused. |

<br>
<hr>
<br>

## ❯ Options

| **name** | **type** | **default** | **description** |
| --- | --- | --- | --- |
| `stdin` | `stream` | `process.stdin` | The input stream to use for emitting keypress events. |
| `stdout` | `stream` | `process.stdout` | The output stream to use for writing the prompt to the terminal. |
| `autofocus` | `string|number` | `undefined` | The index or name of the choice that should have focus when the prompt loads. Only one choice may have focus at a time. |


<br>
<hr>
<br>


## ❯ State



<br>
<hr>
<br>


## ❯ Styles

Styles are semantically-named functions that may be used for adding color (via ANSI style codes) to the various elements of a prompt.

### Default palette

| **Name** | **Default colors** | **Description** |
| --- | --- | --- |
| `primary`       | `cyan`                         | Used on the prompt [indicator](#indicator), choice [pointers](#pointer), and to style user input (the "answer") in the terminal after it's submitted. |
| `danger`        | `red`                          | Used on error messages. |
| `strong`        | `bold`                         | Used on the user-defined [prompt message](#message) |
| `success`       | `green`                        | Used on enabled choice [indicators](#choice-indicator). |
| `warning`       | `yellow`                       | Not used. |
| `muted`         | `dim`                          | Used on hints. |
| `disabled`      | `gray`                         | Used on disabled choice messages. |
| `dark`          | `dim.gray`                     | Used by other styles. |
| `default`       | `noop` (no styling is applied) | Not used. |
| `info`          | `styles.primary`               | Used by the confirm prompt for styling user-input. |
| `inverse`       | Inverse of `styles.primary`    | Not used. |
| `complement`    | Complement of `styles.primary` | Not used. |
| `answered`      | `styles.primary`               | Used in several prompts to style user input after submitted. |
| `cancelled`     | `styles.danger`                | Used to style the prompt prefix when the prompt is cancelled. |
| `completing`    | `styles.default`               | Not used. |
| `pending`       | `styles.default`               | Not used. |
| `on`            | `styles.success`               | Used on checked choice [indicators](#choice-indicator). |
| `off`           | `styles.dark`                  | Used on unchecked choice [indicators](#choice-indicator) (radio buttons, checkboxes, check marks, etc.) |
| `active`        | `styles.primary`               | |
| `selected`      | `styles.active.underline`      | |
| `placeholder`   | `styles.primary.dim`           | |
| `highlight`     | `styles.inverse`               | |

The [ansi-colors][] library is used to apply styling.

### Applying styles

If you are a prompt author, styles may be accessed using `prompt.styles` (or `this.styles` inside a prompt instance), where each "style" is a function that wraps the returned string in ANSI codes.


<br>
<hr>
<br>


## ❯ Events

| **Event** | **Description** |
| --- | --- |
| `state`  | A clone of the `prompt.state` object is emitted for each keypress. |
| `alert`  | Emitted when `prompt.alert()` is called. This is useful for detecting invalid keypresses when output is not visible in the terminal (as in unit tests). |
| `submit` | Emitted with the answer `value` when submitted by the user. |
| `cancel` | Emitted when the prompt is terminated by the user or an error is thrown. |
| `close`  | Emitted when the readline interface is closed and the input stream is paused. |
| `run`    | Emitted when the prompt has been initialized. |
