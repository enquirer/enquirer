### All supported keypresses (Mac)

| **symbol** | **keypress** | **description** |
| --- | --- | --- |
| <kbd>⎋</kbd> | <kbd>escape</kbd> | Escape | 
| <kbd>⇥</kbd> | <kbd>tab</kbd> | Tab forward | 
| <kbd>⇤</kbd> | <kbd>shift</kbd>+<kbd>tab</kbd> | Tab back | 
| <kbd>⇧</kbd> | <kbd>shift</kbd> | Shift | 
| <kbd>⌃</kbd> | <kbd>ctrl</kbd> | Control (or Ctrl)  | 
| <kbd>⌥</kbd> | <kbd>option</kbd> | Option (or Alt) | 
| <kbd>⌘</kbd> | <kbd>cmd</kbd> | Command (or Cmd) | 
| <kbd>␣</kbd> | <kbd>space</kbd> | Space | 
| <kbd>⏎ ↩</kbd> | <kbd>enter</kbd> | Submit (Return) | 
| <kbd>⌫</kbd> | <kbd>backspace</kbd> | Delete back | 
| <kbd>⌦</kbd> | <kbd>fn</kbd>+<kbd>delete</kbd> | Delete forward | 
| <kbd>⇱ ↖ ↸</kbd> | <kbd>home</kbd> | Home | 
| <kbd>⇲ ↘</kbd> | <kbd>end</kbd> | End | 
| <kbd>⇞</kbd> | <kbd>fn</kbd>+<kbd>up arrow</kbd> | Fn-Up Arrow - Page Up: Scroll up one page. | 
| <kbd>⇟</kbd> | <kbd>fn</kbd>+<kbd>down arrow</kbd> | Fn-Down Arrow - Page Down: Scroll down one page. | 
| <kbd>↑ ⇡</kbd> | <kbd>up arrow</kbd> | Up arrow | 
| <kbd>↓ ⇣</kbd> | <kbd>down arrow</kbd> | Down arrow | 
| <kbd>← ⇠</kbd> | <kbd>left arrow</kbd> | Left arrow | 
| <kbd>→ ⇢</kbd> | <kbd>right arrow</kbd> | Right arrow | 

### All supported keypresses (Windows)

| **symbol** | **keypress** | **description** |
| --- | --- | --- |
| <kbd>⎋</kbd> | <kbd>escape</kbd> | Escape |
| <kbd>⇧</kbd> | <kbd>shift</kbd> | Shift |
| <kbd>⌃</kbd> | <kbd>ctrl</kbd> | Control (or Ctrl)  |
| <kbd>⌥</kbd> | <kbd>alt</kbd> | Alt (or Option) |
| <kbd>⌘</kbd> | <kbd>cmd</kbd> | Command (or Cmd) |
| <kbd>⇥</kbd> | <kbd>tab</kbd> | Tab forward |
| <kbd>⇤</kbd> | <kbd>shift</kbd>+<kbd>tab</kbd> | Tab back |
| <kbd>⏎ ↩</kbd> | <kbd>enter</kbd> | Submit (Return) |
| <kbd>⌫</kbd> | <kbd>backspace</kbd> | Delete back |
| <kbd>⌦</kbd> | <kbd>fn</kbd>+<kbd>delete</kbd> | Delete forward |
| <kbd>␣</kbd> | <kbd>space</kbd> | Space |
| <kbd>⇱ ↖ ↸</kbd> | <kbd>home</kbd> | Home |
| <kbd>⇲ ↘</kbd> | <kbd>end</kbd> | End |
| <kbd>⇞</kbd> | <kbd>pageup</kbd> | Pageup |
| <kbd>⇟</kbd> | <kbd>pagedown</kbd> | Pagedown |
| <kbd>↑ ⇡</kbd> | <kbd>up arrow</kbd> | Up arrow |
| <kbd>↓ ⇣</kbd> | <kbd>down arrow</kbd> | Down arrow |
| <kbd>← ⇠</kbd> | <kbd>left arrow</kbd> | Left arrow |
| <kbd>→ ⇢</kbd> | <kbd>right arrow</kbd> | Right arrow |


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

## Shortcuts

The behavior of these shortcuts may vary with the app you're using.

| **Keypress** | **Description** |
| --- | --- |
| **Command-B** | Boldface the selected text, or turn boldfacing on or off. |
| **Command-I** | Italicize the selected text, or turn italics on or off.|
| **Command-K** | Add a web link.|
| **Command-U** | Underline the selected text, or turn underlining on or off.|
| **Command-T** | Show or hide the Fonts window.|
| **Command-D** | Select the Desktop folder from within an Open dialog or Save dialog.|
| **Control-Command-D** | Show or hide the definition of the selected word.|
| **Shift-Command-Colon (** |): Display the Spelling and Grammar window.|
| **Command-Semicolon (;)** | Find misspelled words in the document.|
| **Option-Delete** | Delete the word to the left of the insertion point.|
| **Control-H** | Delete the character to the left of the insertion point. Or use Delete.|
| **Control-D** | Delete the character to the right of the insertion point. Or use Fn-Delete.|
| **Fn-Delete** | Forward delete on keyboards that don't have a Forward Delete   key. Or use Control-D.|
| **Control-K** | Delete the text between the insertion point and the end of the line or paragraph.|
| **Fn–Up Arrow** | Page Up: Scroll up one page. |
| **Fn–Down Arrow** | Page Down: Scroll down one page.|
| **Fn–Left Arrow** | Home: Scroll to the beginning of a document.|
| **Fn–Right Arrow** | End: Scroll to the end of a document.|
| **Command–Up Arrow** | Move the insertion point to the beginning of the document.|
| **Command–Down Arrow** | Move the insertion point to the end of the document.|
| **Command–Left Arrow** | Move the insertion point to the beginning of the current line.|
| **Command–Right Arrow** | Move the insertion point to the end of the current line.|
| **Option–Left Arrow** | Move the insertion point to the beginning of the previous word.|
| **Option–Right Arrow** | Move the insertion point to the end of the next word.|
| **Shift–Command–Up Arrow** | Select the text between the insertion point and the beginning of the document.|
| **Shift–Command–Down Arrow** | Select the text between the insertion point and the end of the document.|
| **Shift–Command–Left Arrow** | Select the text between the insertion point and the beginning of the current line.|
| **Shift–Command–Right Arrow** | Select the text between the insertion point and the end of the current line.|
| **Shift–Up Arrow** | Extend text selection to the nearest character at the same horizontal location on the line above.|
| **Shift–Down Arrow** | Extend text selection to the nearest character at the same horizontal location on the line below.|
| **Shift–Left Arrow** | Extend text selection one character to the left.|
| **Shift–Right Arrow** | Extend text selection one character to the right.|
| **Option–Shift–Up Arrow** | Extend text selection to the beginning of the current paragraph, then to the beginning of the following paragraph if pressed again.|
| **Option–Shift–Down Arrow** | Extend text selection to the end of the current paragraph, then to the end of the following paragraph if pressed again.|
| **Option–Shift–Left Arrow** | Extend text selection to the beginning of the current word, then to the beginning of the following word if pressed again.|
| **Option–Shift–Right Arrow** | Extend text selection to the end of the current word, then to the end of the following word if pressed again.|
| **Control-A** | Move to the beginning of the line or paragraph.|
| **Control-E** | Move to the end of a line or paragraph.|
| **Control-F** | Move one character forward.|
| **Control-B** | Move one character backward.|
| **Control-L** | Center the cursor or selection in the visible area.|
| **Control-P** | Move up one line.|
| **Control-N** | Move down one line.|
| **Control-O** | Insert a new line after the insertion point.|
| **Control-T** | Swap the character behind the insertion point with the character in front of the insertion point.|
| **Command–Left Curly Bracket ({)** | Left align.|
| **Command–Right Curly Bracket (})** | Right align.|
| **Shift–Command–Vertical bar (|)** | Center align.|
| **Option-Command-F** | Go to the search field. |
| **Option-Command-T** | Show or hide a toolbar in the app.|
| **Option-Command-C** | Copy Style: Copy the formatting settings of the selected item to the Clipboard.|
| **Option-Command-V** | Paste Style: Apply the copied style to the selected item.|
| **Option-Shift-Command-V** | Paste and Match Style: Apply the style of the surrounding content to the item pasted within that content.|
| **Option-Command-I** | Show or hide the inspector window.|
| **Shift-Command-P** |  Page setup: Display a window for selecting document settings.|
| **Shift-Command-S** | Display the Save As dialog, or duplicate the current document.|
| **Shift–Command–Minus sign (-)** | Decrease the size of the selected item.|
| **Shift–Command–Plus sign (+)** | Increase the size of the selected item. Command–Equal sign (=) performs the same function.|
| **Shift–Command–Question mark (?)** | Open the Help menu.|


```js
const mapping = {
  cmd: {
    symbol: '⌘',
    description: 'the Command Key symbol'
  },
  option: {
    symbol: '⌥',
    description: 'the Option Key symbol'
  },
  shift: {
    symbol: '⇧',
    description: 'the Shift Key symbol'
  },
  ctrl: {
    symbol: '⌃',
    description: 'the Control Key symbol'
  },
  escape: {
    symbol: '⎋',
    description: 'the ESC Key symbol'
  },
  submit: {
    symbol: '⏎',
    description: 'the Return symbol'
  },
  backspace: {
    symbol: '⌫',
    description: 'the Delete / Backspace symbol'
  },
  tab: {
    symbol: '⇥',
    description: 'the Tab Key symbol'
  }
};
```
