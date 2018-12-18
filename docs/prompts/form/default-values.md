# How to add default values to Form prompts

<!-- toc -->

- [What to expect](#what-to-expect)
- [Define a `prompt`](#example)
- [Set an `initial` value.](#set-an-initial-value)
- [Use previously entered values with `onChoice`](#use-previously-entered-values-with-onchoice)
- [Next steps](#next-steps)
- [Related](#related)

<!-- tocstop -->

## What to expect

You should already know how to create a form prompt. In this guide we will look
at different methods of defining initial/default values.

**In this guide we will show you how to prefill fields.**

We will …

* … set the `initial` property.
* … use the `onChoice` method to use previous field values.

## Example

[Default values example][default-values-example]
![Default values asciicast][default-values-rec]

## Set an `initial` value.

In the last step of the previous guide ([Getting started][getting-started]) we 
filled the `choices: string[] | Choice[]` with three fields.

The easiest way to define initial values is by adding the `initial: string` 
property to our fields.

```js
const { prompt } = require("enquirer");

const results = prompt({
  choices: [
    {
      initial: "Jon",
      message: "First Name",
      name: "firstname"
    },
    // ...
  ],
  // ...
});
```

## Use previously entered values with `onChoice`

We might want to reuse previously entered information in on of our fields.

Let's assume the username: `(firstname + lastname).toLowerCase()`. We can use the
`onChoice(s: State, c: Choice, i: number)` method to grab previously entered values
and use them for our suggestion.

```js
const { prompt } = require("enquirer");

const results = prompt({
  choices: [
    // ...
    {
      message: "GitHub username",
      name: "username",
      onChoice(state, choice, i) {
        const { name, username } = this.values;
        choice.initial = `${username}/${name}`.toLowerCase();
      }
    }
  ],
  // ...
});
```

We now have a complete form with initial values and some logic to define them.

> Your form should now look like this

```js
const { prompt } = require("enquirer");

const results = prompt({
  choices: [
    {
      initial: "Jon",
      message: "First Name",
      name: "firstname"
    },
    {
      initial: "Schlinkert",
      message: "Last Name",
      name: "lastname"
    },
    {
      message: "GitHub username",
      name: "username",
      onChoice(state, choice, i) {
        const { lastname, firstname } = this.values;
        choice.initial = `${firstname}${lastname}`.toLowerCase();
      }
    }
  ],
  message: "Please provide the following information:",
  name: "user",
  type: "form"
});
```


## Next steps

You should now be comfortable with initial values. In the next steps we will
look at some options to add some spice to your form.

* ...


## Related

* ...

[getting-started]: https://github.com/enquirer/enquirer/tree/master/docs/form/getting-started.md
[default-values-rec]: https://uploads.codesandbox.io/uploads/user/d4803626-4dbe-4304-b684-7d790aa169f0/RfvF-form_default_values_001.svg
[default-values-example]: https://github.com/enquirer/enquirer/tree/master/guide/lib/prompts/form/default-values.js
