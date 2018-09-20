
## Why use this?

* Minimal - Only one dependency ([ansi-colors](https://github.com/doowb/ansi-colors)). ([inquirer][] has 32!)
* Fast! - loads in 3ms! (that's about 10 times faster than a [single frame of a movie][framerate] at 30fps).


See a [comparison to other libraries](#comparison)

## Install
{%= include("install-npm", { save: true }) %}

## Usage

**Question**

Pass a string or question object to the constructor:

```js
const Confirm = require('{%= name %}');
const prompt = new Confirm('Do you like chocolate?');

// or
const prompt = new Confirm({
  name: 'chocolate',
  message: 'Do you like chocolate?'
});
```

**Run the prompt**

You can use one of the following two methods for running the prompt:

```js
// async
prompt.ask(function(answer) {
  console.log(answer);
});

// or promise
prompt.run()
  .then(function(answer) {
    console.log(answer);
  });
```

**Examples**

```js
new Confirm('Like chocolate?')
  .run()
  .then(function(answer) {
    console.log(answer);
  });
```

## Prompt history

**Interface**

```
interface History {
  past: Array<String>,
  present: String
}
```

## Usage with [enquirer][]

```js
const Enquirer = require('enquirer');
const enquirer = new Enquirer();

enquirer.register('{%= alias %}', require('{%= name %}'));
```

### Enquirer example

[Enquirer][] supports either the declarative object-oriented (inquirer-style) question format or a more expressive format using the `.question` method.

**Declarative**

Inquirer-style declarative format (takes an array or object):

```js
const questions = [
  {
    type: '{%= alias %}',
    name: 'chocolate',
    message: 'Like chocolate?'
  },
  {
    type: '{%= alias %}',
    name: 'vanilla',
    message: 'Like vanilla?'
  }
];

enquirer.ask(questions)
  .then(function(answers) {
    console.log(answers)
  });
```

**Expressive**

Pre-define questions and easily compose prompts by passing the name(s) of the prompts to run:

```js
enquirer.question('chocolate', 'Like chocolate?', { type: '{%= alias %}' });
enquirer.question('vanilla', 'Like vanilla?', { type: '{%= alias %}' });

enquirer
  .prompt(['chocolate', 'vanilla'])
  .then(function(answers) {
    console.log(answers)
  });
```

## Credit

A few libraries influenced the creation of this library:

- [inquirer][] - `inquirer` inspired the class-based prompt concept we're using.
- [prompts][] - `prompts` inspired the simplicity of "actions" in our prompts. We really liked how the code was written, the lack of abstractions makes the code easy to work with an understand.
- [prompt-skeleton][] - The [prompts][] library is based on the work of [derhuerst](https://github.com/derhuerst) (including [prompt-skeleton][] and related libs).

## Comparison

| **Feature** | **{%= name %}** | **prompts** | **Inquirer** |
| --- | --- | --- | --- | --- |
| Dependencies | 1 | 2 | 32 |
| Load time | `2.9ms` | `8.781ms` (10% slower) | `191.380ms` (2,300% slower) |
| Class-based | ✔ | ✔ | ✔ |

## Comparison (Enquirer)

| **Feature** | **{%= name %}** | **prompts** | **Inquirer** |
| --- | --- | --- | --- | --- |
| Dependencies | 1 | 2 | 32 |
| Load time | `8.019ms` | `8.781ms` (~10% slower) | `191.380ms` (~2,400% slower) |
| Class-based | ✔ | ✖ | ✖ |
| Plugins | ✔ | ✖ | ✖ |

### Dependencies

Having fewer dependencies isn't always an advantage. Although fewer dependencies **might** result in faster initialization time for a library, it doesn't always, and it sometimes comes at the cost of other tradeoffs, such as poor performance after initialization, less stable code, or code that was stolen from other libraries without respecting the copyright or license of those libraries[^1].


### Advantages of being class-based

Being class-based allows users to instantiate Enquirer before actually running the prompts. As a result, users can extend Enquirer... (tbc)


## Performance

MacBook Pro, Intel Core i7, 2.5 GHz, 16 GB.

### Load time

Time it takes to load the module the first time:

```
inquirer: 191.380ms (~6 movie frames)
prompts: 8.781ms (~0.2 movie frames)
prompt-base: 8.019ms (~0.2 movie frames)
```

**Whis is this important?**

`prompts` and `prompt-base` load as fast as 0.24 movie frames, which is imperceptible by humans. `inquirer` on the other hand, loads about as fast as nearly 6 movie frames, which is easily noticeable and seems slow to impatient humans. Considering that prompts are just one part of your toolkit when building an interface to users, a library like Inquirer can make the entire process feel slow and annoying.


### Inquirer

However, we didn't like that Inquirer depended on lodash, and that the code itself is much more verbose and "heavy" than is necessary. Inquirer also has a lot of usability


[framerate]: http://www.endmemo.com/sconvert/framespersecondframespermillisecond.php
