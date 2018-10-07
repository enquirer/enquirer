# Enquirer Cheatsheet

- [Terminology](#terminology)
- [Keypresses](#keypresses)
- [Properties](#properties)
- [Methods](#methods)
- [Options](#options)
- [Events](#events)

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


## Keypresses

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


## Array prompts

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


## Methods

| **term** | **description** |
| --- | --- |
| `focus` | Sets focus on the specified choice, if it can be focused. |


## Getters

| **term** | **description** |
| --- | --- |
| `prompt.focused` | Gets the currently selected choice. Equivalent to `prompt.choices[prompt.index]`. |


## Options

| **name** | **type** | **default** | **description** |
| --- | --- |
| `stdin` | `stream` | `process.stdin` | The input stream to use for emitting keypress events. |
| `stdout` | `stream` | `process.stdout` | The output stream to use for writing the prompt to the terminal. |
| `autofocus` | `string|number` | `undefined` | The index or name of the choice that should have focus when the prompt loads. Only one choice may have focus at a time. |


## Text prompt

- `minLength`
- `maxLength`
- `autocomplete`
- `required`


## Themes

Themes define the palette of colors to be applied to the various sections of a prompt. 

### Theme styles


| **Name** | **Default colors** | **Description** |
| --- | --- | --- |
| `primary`       | `cyan`          | Used on the prompt [indicator](#indicator), choice [pointers](#pointer), and user input after submitted. |
| `danger`        | `red`           | Used on error messages. |
| `strong`        | `bold`          | Used on the user-defined [prompt message](#message). |
| `success`       | `green`         | Used on  |
| `warning`       | `yellow`        |  |
| `muted`         | `dim`           |  |
| `disabled`      | `gray`          |  |
| `dark`          | `dim_gray`      |  |
| `default`       | `noop` (no styling is applied)       |   | 
| `info`          | `theme.primary`                      |   | 
| `inverse`       | Inverse of `theme.primary`      |   | 
| `complement`    | Complement of `theme.primary` |   | 
| `pending`       | `theme.default`                      |   | 
| `completing`    | `theme.default`                      |   | 
| `cancelled`     | `theme.default`                      |   | 
| `answered`      | `theme.primary`                      |   | 
| `on`            | `theme.success`                      | Used on checked indicators. | 
| `off`           | `theme.dark`                         | Used on unchecked indicators. | 
| `active`        | `theme.primary`                      |   | 
| `selected`      | `theme.active.underline`             |   | 
| `placeholder`   | `theme.primary.dim`                  |   | 
| `highlight`     | `theme.inverse`                      |   | 
| `opposite`      | `utils.inverse`                      |   | 
| `complementary` | `utils.complement`                   |   | 

The [ansi-colors][] library is used to apply styling. 

### Applying styles

If you are a prompt author, styles may be accessed inside a prompt instance on the `this.theme` object, where each "style" is a function that wraps the returned string in ANSI codes. 

## Events

| **Event** | **Description** |
| --- | --- |
| `state`  | A clone of the `prompt.state` object is emitted for each keypress. |
| `alert`  | Emitted when `prompt.alert()` is called. This is useful for detecting invalid keypresses when output is not visible in the terminal (as in unit tests). |
| `submit` | Emitted with the answer `value` when submitted by the user. |
| `cancel` | Emitted when the prompt is terminated by the user or an error is thrown. |
| `close`  | Emitted when the readline interface is closed and the input stream is paused. |
| `run`    | Emitted when the prompt has been initialized. |


## Events

| **Event name** | **Description** |
| --- | --- |
| `run`      | Emitted when the `.run()` method is called, after the [readline][] interface is created. |
| `keypress` |  |
| `state`    | Emitted at the same time as `keypress`, but emits the object returned from the [prompt.state()](#state) method. This object has useful state properties such as [status](#property-status) [cursor](#property-cursor) [value](#property-value) [typed](#property-typed) [error](#property-error) etc. |
| `submit`   |  |
| `abort`    | Emitted when an error occurs or when the user terminates the session early. |
