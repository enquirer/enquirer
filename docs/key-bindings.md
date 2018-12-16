# Key Bindings

## All prompts

These key combinations may be used with all prompts.

| **command** | **description** |
| --- | --- |
| <kbd>ctrl</kbd>+<kbd>c</kbd> | Cancel the prompt. |
| <kbd>ctrl</kbd>+<kbd>g</kdb> | Reset the prompt to its initial state. |

<br>

## Move cursor

These combinations may be used on prompts that support user input, such as the [input prompt](#input-prompt), [password prompt](#password-prompt), and [invisible prompt](#invisible-prompt)).

| **command** | **description** |
| --- | --- |
| <kbd>left</kbd> | Move the cursor forward one character. |
| <kbd>right</kbd> | Move the cursor back one character. |
| <kbd>ctrl</kbd>+<kbd>a</kbd> | Move cursor to the start of the line |
| <kbd>ctrl</kbd>+<kbd>e</kbd> | Move cursor to the end of the line |
| <kbd>ctrl</kbd>+<kbd>b</kbd> | Move cursor back one character |
| <kbd>ctrl</kbd>+<kbd>f</kbd> | Move cursor forward one character |
| <kbd>ctrl</kbd>+<kbd>x</kbd> | Toggle between first and cursor position |

<br>

## Edit Input

These key combinations may be used on prompts that support user input, such as the [input prompt](#input-prompt), [password prompt](#password-prompt), and [invisible prompt](#invisible-prompt)).

| **command** | **description** |
| --- | --- |
| <kbd>ctrl</kbd>+<kbd>a</kbd> | Move cursor to the start of the line |
| <kbd>ctrl</kbd>+<kbd>e</kbd> | Move cursor to the end of the line |
| <kbd>ctrl</kbd>+<kbd>b</kbd> | Move cursor back one character |
| <kbd>ctrl</kbd>+<kbd>f</kbd> | Move cursor forward one character |
| <kbd>ctrl</kbd>+<kbd>x</kbd> | Toggle between first and cursor position |

### Mac

| **command** | **description** |
| --- | --- |
| <kbd>delete</kbd> | Delete one character to the left. |
| <kbd>fn</kbd>+<kbd>delete</kbd> | Delete one character to the right. |
| <kbd>option</kbd>+<kbd>up</kbd> | Scroll to the previous item in history ([Input prompt](#input-prompt) only, when [history is enabled](examples/input/option-history.js)). |
| <kbd>option</kbd>+<kbd>down</kbd> | Scroll to the next item in history ([Input prompt](#input-prompt) only, when [history is enabled](examples/input/option-history.js)). |

### Windows

| **command** | **description** |
| --- | --- |
| <kbd>backspace</kbd> | Delete one character to the left. |
| <kbd>delete</kbd> | Delete one character to the right (forward). |
| <kbd>alt</kbd>+<kbd>up</kbd> | Scroll to the previous item in history ([Input prompt](#input-prompt) only, when [history is enabled](examples/input/option-history.js)). |
| <kbd>alt</kbd>+<kbd>down</kbd> | Scroll to the next item in history ([Input prompt](#input-prompt) only, when [history is enabled](examples/input/option-history.js)). |

<br>

## Select choices

These key combinations may be used on prompts that support _multiple_ choices, such as the [multiselect prompt](#multiselect-prompt), or the [select prompt](#select-prompt) when the `multiple` options is true.

| **command** | **description** |
| --- | --- |
| <kbd>space</kbd> | Toggle the currently selected choice when `options.multiple` is true. |
| <kbd>number</kbd> | Move the pointer to the choice at the given index. Also toggles the selected choice when `options.multiple` is true. |
| <kbd>a</kbd> | Toggle all choices to be enabled or disabled. |
| <kbd>i</kbd> | Invert the current selection of choices. |
| <kbd>g</kbd> | Toggle the current choice group. |

<br>

## Hide/show choices

| **command** | **description** |
| --- | --- |
| <kbd>fn</kbd>+<kbd>up</kbd> | Decrease the number of visible choices by one. |
| <kbd>fn</kbd>+<kbd>down</kbd> | Increase the number of visible choices by one. |

<br>

## Move/lock Pointer

| **command** | **description** |
| --- | --- |
| <kbd>number</kbd> | Move the pointer to the choice at the given index. Also toggles the selected choice when `options.multiple` is true. |
| <kbd>up</kbd> | Move the pointer up. |
| <kbd>down</kbd> | Move the pointer down. |
| <kbd>ctrl</kbd>+<kbd>a</kbd> | Move the pointer to the first _visible_ choice. |
| <kbd>ctrl</kbd>+<kbd>e</kbd> | Move the pointer to the last _visible_ choice. |
| <kbd>shift</kbd>+<kbd>up</kbd> | Scroll up one choice without changing pointer position (locks the pointer while scrolling). |
| <kbd>shift</kbd>+<kbd>down</kbd> | Scroll down one choice without changing pointer position (locks the pointer while scrolling). |

### Mac

| **command** | **description** |
| --- | --- |
| <kbd>fn</kbd>+<kbd>left</kbd> | Move the pointer to the first choice in the choices array. |
| <kbd>fn</kbd>+<kbd>right</kbd> | Move the pointer to the last choice in the choices array. |

### Windows

| **command** | **description** |
| --- | --- |
| <kbd>home</kbd> | Move the pointer to the first choice in the choices array. |
| <kbd>end</kbd> | Move the pointer to the last choice in the choices array. |
