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

TODO - insert keypresses here.


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

