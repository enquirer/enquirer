# Your kickstart into Form prompts

<!-- toc -->

- [What to expect](#what-to-expect)
- [Example](#what-to-expect)
- [Define a `prompt`](#example)
- [Transform the prompt into a Form](#transform-the-prompt-into-a-form)
- [Add fields](#add-fields)
- [Next steps](#next-steps)
- [Related](#related)

<!-- tocstop -->

## What to expect

Form prompts can be very helpful when building a CLI tool. A form allows the 
user to navigate the fields while entering and offers several helpful options.

**In this guide we will show you the basic usage of a form prompt.**

We will …

* … create a basic prompt.
* … transform the prompt into a form.
* … add fields to our form.

## Example

[Getting started example][getting-started-example]
![Getting started asciicast][getting-started-rec]

## Define a `prompt`

To use the form prompt you we to import `{prompt}`.  
We can then define a prompt as usual. We will start with a name input.

```js
const { prompt } = require("enquirer");

const results = prompt({
  message: "First Name:",
  name: "firstname",
  type: "input"
});
```

## Transform the prompt into a Form
  
To make a form we need to add the `type: "form"` and 
`choices: string[] | Choice[]` properties to our prompt configuration. 

Let's add our field as the first choice, change the `message: string` to describe the
entire form and give our form a unique `name: string`

```js
const { prompt } = require("enquirer");

const results = prompt({
  choices: [{
    message: "First Name",
    name: "firstname"
  }],
  message: "Please provide the following information:",
  name: "user",
  type: "form"
});
```

## Add fields

We can now continue adding fields to our form.

> Your form should now look like this

```js
const { prompt } = require("enquirer");

const results = prompt({
  choices: [
    {
      message: "First Name",
      name: "firstname"
    },
    {
      message: "Last Name",
      name: "lastname"
    },
    {
      message: "GitHub username",
      name: "username"
    }
  ],
  message: "Please provide the following information:",
  name: "user",
  type: "form"
});
```

## Next steps

You should now be comfortable with basic form prompts. In the next steps we will
look at some options to add some spice to our form.

* [Default values][default-values]


## Related

* [Default values][default-values]

[default-values]: https://github.com/enquirer/enquirer/tree/master/docs/form/default-values.md
[getting-started-rec]: https://uploads.codesandbox.io/uploads/user/d4803626-4dbe-4304-b684-7d790aa169f0/eKw4-form_getting-started_001.svg
[getting-started-example]: https://github.com/enquirer/enquirer/tree/master/guide/lib/prompts/form/getting-started.js
