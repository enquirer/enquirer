# Just the Facts

## Enquirer

- The main export is the [Enquirer](#enquirer) class.
- The `Enquirer` class has methods for running and registering prompts.
- Enquirer has a number of built-in prompts. Each is is tailored for a different use case, such as handling passwords, user input, yes/no questions, and so on.
- All prompts are based on the [Prompt](#prompt) class, which is responsible for listenting for keypress events, handling user input, figuring out which methods to call based on the keypress event, and dispatching the necessary methods to render output to the terminal.
- Prompts take a single "question" object, and return a single value.
- The type of value returned by a prompt differs based on its purpose. For example, the `MultiSelect` prompt returns an array of values, and the `Confirm` prompt returns a boolean value.
- Prompts are responsible for updating the state based on user input and interaction.
- Prompts are responsible for rendering the prompt ("question") in the terminal, and for re-rendering the prompt every time: 1) a keypress event is emitted, or 2) a timer trigger a re-render (as with spinners or loading indicators).
- The static `Enquirer.prompt()` method (`const { prompt } = require('enquirer')`) is the easiest way to start running prompts.
- If you need to listen for events, use plugins, or register custom prompts, you will need to create an instance of Enquirer: `const enquirer = new Enquirer()`.

**Pseudo-code**

The following pseudo-code is intended to provide a high-level understanding of how the `Enquirer` class works.

```js
const prompts = require('./lib/prompts');

class Enquirer {
  constructor(options, answers) {
    this.options = options;
    this.answers = answers;
  }

  async prompt(questions) {
    for (let question of questions) {
      let Prompt = prompts[question.name];
      let prompt = new Prompt(question);
      let answer = await prompt.run();
      this.answers[question.name] = answer;
    } 
    return this.answers;
  }
}
```

creates an instance of the `Prompt` class 

## Prompt

- Enquirer uses the `Prompt` class for 
- The `Prompt` class handles user input and rendering to the terminal.
- Node's [readline](https://nodejs.org/api/readline.html) module provides the interface for handling keypresses. By default:
- `process.stdin` handles keypresses. You may override this with `options.stdin`.
- `process.stdout` handles writing output to the terminal. You may override this with `options.stdout`.
- The `Prompt` 
