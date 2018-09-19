---
layout: default
title: Prompts
---

Enquirer ships with a number of useful prompts, but it's also really easy to [create new prompts](#discovering-prompts) when you [need something different](#discovering-prompts).

# Included Prompts

The following prompts are included with Enquirer.

- [autocomplete](#autocomplete)
- [confirm](#confirm)
- [invisible](#invisible)
- [multiselect](#multiselect)
- [number](#number)
- [password](#password)
- [select](#select)
- [split](#split)
- [text](#text)
- [toggle](#toggle)

## Discovering prompts

You can [find prompts](https://www.npmjs.com/browse/keyword/enquirer) created by the Enquirer core team or the community on npm (`https://www.npmjs.com/browse/keyword/enquirer`).


## Authoring prompts

**Why create a prompt for Enquirer?**

Custom prompts are easy to write, and can be used to:

- override or extend existing functionality or default behavior of [prompt-base][]
- change how options are handled
- customize the prompt message, rendering, colors, pointer, symbols, hints, error messages and any other aspect of the prompt experience

**Learn the basics**

Before moving on to authoring prompts, it might help to understand how the prompts work:

- [ ] Learn about prompts, and how they work (prompt-base, etc)
- [ ] Learn about {{titleize @project.name}} [core concepts](docs.html#core-concepts)
- [ ] Learn how the {{titleize @project.name}} code base is organized, and why.
- [ ] Learn about the Enquirer API
- [ ] Learn about debugging

### Writing your first prompt

All prompts inherit from [prompt-base][], which is a constructor function that must be called with a question string or object.

**Example**

```js
var Prompt = require('prompt-base');

function CustomPrompt() {
  Prompt.apply(this, arguments);
}

Prompt.extend(CustomPrompt);
```

_(The `Prompt.extend()` method is similar to `util.inherits()`, but it ensures that all properties are inherited and will be invoked in the correct context, including getters and setters)_


**Usage example**

Once published, users will be able to use your prompt like this:

```js
var Prompt = require('prompt-awesome');

var prompt = new Prompt({
  name: 'fun',
  message: 'Having fun yet?!'
});

prompt.run()
  .then(function(answer) {
    console.log(answer);
    //=> 'of course!'
  })
```

### Publishing your prompt

**Make your prompt discoverable**

If you author a custom prompt, be sure to add `enquirer` and `enquirer-prompt` to the `keywords` array in your project's package.json before publishing to NPM.

**Publish**

When you're ready to publish your prompt to [npm](https://www.npmjs.com/), you can do so with the following command from the root of your project:

```sh
$ npm publish
```

## Next steps

Now that you've published your custom prompt, make sure you tell the world about the great work you've done!

* Show your love by starring [Enquirer](https://github.com/enquirer/enquirer)
* To make your project as discoverable as possible, please add the keywords `enquirer` and `enquirer-prompt` to package.json.
* Tweet about it, and be sure to mention `@enquirerjs` or use the `#enquirerjs` hashtag (don't forget the `js` part on twitter)
* Get implementation help on [StackOverflow](http://stackoverflow.com/questions/tagged/enquirer) (as with twitter, please use the `enquirerjs` tag in questions)
