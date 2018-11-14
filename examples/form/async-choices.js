const path = require('path');
const ansi = require('../../lib/ansi');
const { Form, Input } = require('../..');

/**
 * This example shows how prompts can be used to populate choices.
 */

/**
 * First, let's wrap the Input prompt to cut down on boilerplate,
 * since we know in advance that we only need to define a few options.
 */

const input = (name, message, initial) => {
  return prompt => {
    let p = new Input({ name, message, initial });
    return p.run().then(value => ({ name, message, initial: value, value }));
  };
};

/**
 * Now will will define a few choices on the Form prompt using the
 * 'input' function we just created. Since the prompt won't run until
 * all async choices are resolved, each input-question will be asked
 * in series before the Form prompt actually runs and displays the
 * choices. This creates a nice effect of allowing the user to
 * review their answers before submitting the final result.
 */


const prompt = new Form({
  name: 'user',
  message: 'Please review your answers:',
  choices: [
    input('name', 'Project name', path.basename(process.cwd())),
    input('author', 'Author name', 'jonschlinkert'),
    input('username', 'GitHub username/org', 'enquirer'),
    {
      name: 'repo',
      message: 'Repository URL',
      onChoice(state, choice, i) {
        let { name, username } = this.values;
        choice.initial = `https://github.com/${username}/${name}`;
      }
    }
  ]
});

prompt.run()
  .then(answers => console.log('ANSWERS:', answers))
  .catch(console.error);
