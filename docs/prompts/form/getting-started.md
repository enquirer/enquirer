# Your kickstart into Form prompts

<!-- toc -->

- [What to expect](#what-to-expect)
- [Define a `prompt`](#define-a-prompt)
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

## Define a `prompt`

To use the form prompt you need to import `{prompt}`.  
You can then define a prompt as usual. Let's make it a name input.

```js
import {prompt} from "enquirer"

const results = prompt({
  message: "First Name:",
  name: "firstname",
  type: "input"
});
```

## Transform the prompt into a Form
  
To transform our prompt into a form we need to add the `type: "form"` and 
`choices: string[] | Choice[]` properties to our prompt configuration. 

Let's add our field as the first choice, change the `message: string` to describe the
entire form and give our form a unique `name: string`

```js
import { prompt } from "enquirer";

const results = prompt({
  choices: [{
    name: "firstname",
    message: "First Name"
  }],
  message: "Please provide the following information:",
  name: "user",
  type: "form"
});
```

## Add fields

Form choices can take up several lines of code so we will move them to a new
file.  

**choices.js**

```js
export default [
  {
    name: "firstname",
    message: "First Name"
  },
  {
    name: "lastname",
    message: "Last Name"
  },
  {
    name: "username",
    message: "GitHub username"
  }
];
```

The choices can now be imported into our original file to make our prompt a
complete form.

**form.js**

```js
import { prompt } from "enquirer";
import choices from "./choices";

const results = prompt({
  choices,
  message: "Please provide the following information:",
  name: "user",
  type: "form"
});
```

## Next steps

You should now be comfortable with basic form prompts. In the next steps we will
look at some options to add some spice to your form.

* [Custom pointer](#next-steps)


## Related

* [Custom pointer](#next-steps)
* [Custom symbols](#next-steps)
* [Hint](#next-steps)
* [Field validation](#next-steps)
* [Required fields](#next-steps)
* [Default values](#next-steps)
* [Resetting](#next-steps)

**Todo**

- [ ] Custom pointer
- [ ] Custom symbols
- [ ] Hint
- [ ] ~~History / completion~~ (coming soon!)
- [ ] Field validation
- [ ] Required fields
- [ ] Default values
- [ ] Resetting
