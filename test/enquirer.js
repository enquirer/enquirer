import * as assert from 'assert';
import colors from 'ansi-colors';
import Enquirer from '../index.js';

const { Input } = Enquirer;
let enquirer;

describe('Enquirer', function() {
  describe('inheritance', () => {
    it('should support inheritance', cb => {
      class Custom extends Enquirer {}

      const { prompt } = Custom;

      prompt.on('prompt', p => {
        p.value = 'orange';
        p.submit();
      });

      prompt({
        type: 'input',
        name: 'color',
        message: 'Favorite color?',
        show: false
      })
        .then(answers => {
          assert.equal(answers.color, 'orange');
          cb();
        });
    });
  });

  describe('questions', () => {
    it('should run a single question object', () => {
      enquirer = new Enquirer({ show: false });
      enquirer.on('prompt', prompt => {
        prompt.value = 'orange';
        prompt.submit();
      });

      enquirer.prompt({
        type: 'input',
        name: 'color',
        message: 'Favorite color?'
      })
        .then(answers => {
          assert.equal(answers.color, 'orange');
        });
    });

    it('should run an array of questions', () => {
      enquirer = new Enquirer({ show: false });
      enquirer.on('prompt', prompt => {
        if (prompt.name === 'color') {
          prompt.value = 'blue';
        } else {
          prompt.value = 'Brian';
        }
        prompt.submit();
      });

      enquirer.prompt([{
        type: 'input',
        name: 'color',
        message: 'Favorite color?'
      },
      {
        type: 'input',
        name: 'name',
        message: 'What is your name?'
      }])
        .then(answers => {
          assert.equal(answers.color, 'blue');
          assert.equal(answers.name, 'Brian');
        });
    });
  });

  describe('static .prompt()', () => {
    it('should run a single question object', () => {
      const { prompt } = Enquirer;

      prompt.on('prompt', prompt => {
        prompt.value = 'orange';
        prompt.submit();
      });

      prompt({
        type: 'input',
        name: 'color',
        message: 'Favorite color?',
        show: false
      })
        .then(answers => {
          assert.equal(answers.color, 'orange');
        });
    });

    it('should run an array of questions', () => {
      const { prompt } = Enquirer;
      prompt.on('prompt', prompt => {
        prompt.value = prompt.name === 'color' ? 'blue' : 'Brian';
        prompt.submit();
      });

      prompt([{
        type: 'input',
        name: 'color',
        message: 'Favorite color?',
        show: false
      },
      {
        type: 'input',
        name: 'name',
        message: 'What is your name?',
        show: false
      }])
        .then(answers => {
          assert.equal(answers.color, 'blue');
          assert.equal(answers.name, 'Brian');
        });
    });
  });

  describe('options', () => {
    it('should accept `stdin` and `stdout` replacements', () => {
      const stdin = process.stdin;
      const stdout = process.stdout;
      let count = 0;
      let error;

      enquirer = new Enquirer({ stdin, stdout });
      enquirer.once('prompt', async prompt => {
        try {
          count++;
          prompt.state.input = 'ok';
          prompt.submit();
          await prompt.render();
        } catch (err) {
          error = err;
        }
      });

      enquirer.prompt({
        type: 'input',
        name: 'test',
        message: 'Type something?'
      })
        .then(answers => {
          assert.equal(count, 1);
          assert.equal(answers.test, 'ok');
        });
    });

    it('should pass enquirer options to prompts', () => {
      let count = 0;
      let error;

      enquirer = new Enquirer({
        show: false,
        styles: {
          primary: colors.blue
        }
      });

      enquirer.once('prompt', async prompt => {
        try {
          count++;
          prompt.state.input = 'orange';
          prompt.submit();
          assert.equal(prompt.styles.primary('orange'), colors.blue('orange'));
          assert.equal(await prompt.format(), colors.green('orange'));
          await prompt.render();
        } catch (err) {
          error = err;
        }
      });

      enquirer.prompt({
        type: 'input',
        name: 'color',
        message: 'Favorite color?'
      })
        .then(answers => {
          assert.equal(count, 1);
          assert.equal(answers.color, 'orange');
        });
    });
  });

  describe('onSubmit', () => {
    it('should call onSubmit when a prompt is submitted before without initializing', () => {
      let called = 0;
      enquirer = new Enquirer({
        show: false,
        onSubmit(name, value) {
          this.value = 'orange';
          called++;
        }
      });

      enquirer.on('prompt', async prompt => {
        await prompt.submit();
      });

      enquirer.prompt({
        type: 'input',
        name: 'color',
        message: 'Favorite color?'
      })
        .then(answers => {
          assert.equal(called, 1);
          assert.equal(answers.color, 'orange');
        });
    });

    it('should call onSubmit if prompt is initialized', () => {
      let called = 0;
      enquirer = new Enquirer({
        show: false,
        onSubmit(name, value) {
          this.value = 'orange';
          called++;
        }
      });

      enquirer.on('prompt', prompt => {
        prompt.on('run', async() => {
          await prompt.submit();
        });
      });

      enquirer.prompt({
        type: 'input',
        name: 'color',
        message: 'Favorite color?'
      })
        .then(answers => {
          assert.equal(called, 1);
          assert.equal(answers.color, 'orange');
        });
    });

    it('should await onSubmit when a prompt submitted', () => {
      let called = 0;

      enquirer = new Enquirer({
        show: false,
        onSubmit(name, value, state) {
          return new Promise(resolve => {
            setTimeout(() => {
              assert.equal(value, name === 'flavor' ? 'orange' : 'blue');
              called++;
              resolve();
            }, 10);
          });
        }
      });

      enquirer.on('prompt', prompt => {
        prompt.value = prompt.name === 'flavor' ? 'orange' : 'blue';
        prompt.submit();
      });

      return enquirer.prompt([
        {
          type: 'input',
          name: 'flavor',
          message: 'Favorite flavor?'
        },
        {
          type: 'input',
          name: 'color',
          message: 'Favorite color?'
        }
      ])
        .then(() => {
          assert.equal(called, 2);
        });
    });
  });

  describe('.register', () => {
    beforeEach(() => {
      enquirer = new Enquirer({ show: false });
    });

    it('should register a custom prompt type as a class', () => {
      class Foo extends Input {}

      enquirer.register('foo', Foo);
      enquirer = new Enquirer({
        show: false,
        autofill: true
      }, {
        color: 'orange'
      });

      return enquirer.prompt({
        type: 'foo',
        name: 'color',
        message: 'Favorite color?'
      })
        .then(answers => {
          assert.equal(answers.color, 'orange');
        });
    });

    it('should register a custom prompt type as a function', () => {
      class Foo extends Input {}

      enquirer.register('foo', () => Foo);
      enquirer = new Enquirer({
        show: false,
        autofill: true
      }, {
        color: 'orange'
      });

      return enquirer.prompt({
        type: 'foo',
        name: 'color',
        message: 'Favorite color?'
      })
        .then(answers => {
          assert.equal(answers.color, 'orange');
        });
    });
  });

  describe('options.autofill', () => {
    it('should autofill answers', () => {
      enquirer = new Enquirer({
        show: false,
        autofill: true
      }, {
        color: 'orange'
      });

      return enquirer.prompt({
        type: 'input',
        name: 'color',
        message: 'Favorite color?'
      })
        .then(answers => {
          assert.equal(answers.color, 'orange');
        });
    });
  });
});
