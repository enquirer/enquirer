# State

- [state](#state) -  The `state` contains the necessary properties for rendering each part of a prompt in the terminal.

| **term** | **description** |
| --- | --- |
| `type` | It shows the type of prompt created if specified in prompt |
| `name` | It shows name of the prompt given by user|
| `index` | It will show index of the prompt, by default `0` |
| `message` | It shows the message to display in prompt created, if specified in prompt |
| `header` | The header to be display in created prompt |
| `footer` | The footer to be display in created prompt |
| `error` | The error message to be shown if prompt is cancelled |
| `hint` | It will contain the hint specified by the user in prompt, by default `''` |
| `input` | It will contain the `stdin` if given, by default `''` |
| `cursor` | The position of the console cursor to print |
| `lines` | The number of lines given in the prompt, by default `0` |
| `prompt` | The prompt value in the console. |
| `width` | The width size of the prompt in console. |
| `symbols` | It will have the symbols that we use to show in prompt, for e.g: `-,?`|
| `styles` | The styles will have all the available styles in enquirer |
| `required` | It will return a Set of all required values |
| `cancelled` | It is a function that will execute when user presses <kbd>ctrl</kbd>+<kbd>c</kbd> |
| `submitted` | It is a function that will execute when user successfully executes the prompt by pressing  <kbd>Enter</kbd> |

#### Example

State {
  type: undefined,
  name: 'color',
  message: 'Pick a flavor',
  header: '',
  footer: '',
  error: '',
  hint: '',
  input: '',
  cursor: 0,
  index: 0,
  lines: 0,
  tick: 0,
  prompt: '\u001b[36m?\u001b[39m \u001b[1mPick a flavor\u001b[22m \u001b[2m…\u001b[22m ',
  buffer: '',
  width: 186,
  multiple: true,
  choices: [],
  indicator: [Function: indicator],
  symbols: {}, //Symbols used in enquirer
  styles: {}, // Styles used in enquirer
  required: Set(0) {},
  cancelled: false,
  submitted: false,
  _choices: [],
  loadingChoices: false,
  timer: undefined
}
