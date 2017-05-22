---
layout: default
title: Prompts
---

## Finding prompts

You can find [community prompts](https://www.npmjs.com/browse/keyword/{{@site.name}}) on npm (`https://www.npmjs.com/browse/keyword/{{@site.name}}`).

If you author an {{@site.name}} prompt, be sure to add `{{@site.name}}` and `{{@site.name}}-prompt` to the `keywords` array in your project's package.json.

## Authoring prompts

**Why create a prompt for {{@site.name}}?**

Prompts are easy to write, and can be used to:

- customize the prompt message, rendering, colors, pointer, symbols and any other aspect of the prompt experience
- override existing functionality in [prompt-base][]
- extend the functionality of [prompt-base][]
- change how options are handled

**Learn the basics**

Before moving on to authoring prompts, it might help to understand how the prompts work:

- [ ] Learn about prompts, and how they work (prompt-base, etc)
- [ ] Learn about {{titleize @site.name}} [core concepts](docs.html#core-concepts)
- [ ] Learn how the {{titleize @site.name}} code base is organized, and why.
- [ ] Learn about the Enquirer API
- [ ] Learn about debugging


### Writing your first prompt

A {{@site.name}} prompt is a constructor function that must be called with a question string or object.

At present, all prompts inherit from [prompt-base][].

**Example**

```js
var Prompt = require('prompt-base');

function Awesome() {
  Prompt.apply(this, arguments);
}

Prompt.extend(Awesome);
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

## Publishing your prompt

When you're ready to publish your prompt to [npm](https://www.npmjs.com/), you can do so with the following command from the root of the project:

_(Are you sure you're ready?!)_

```sh
$ npm publish
```

## Next steps

Now that you've published your custom prompt, let's tell the world about the great work you've done!

* To make your project as discoverable as possible, please add the keywords `{{@site.name}}` and `{{@site.name}}-prompt` to package.json.
* Tweet about it, and be sure to mention `@{{@site.name}}js` or use the `#{{@site.name}}js` hashtag (don't forget the `js` part on twitter, so the world knows you mean code, not dancing)
* Show your love by starring [{{@site.name}}](https://github.com/{{@site.name}}/{{@site.name}})
* Get implementation help on [StackOverflow](http://stackoverflow.com/questions/tagged/{{@site.name}}) (as with twitter, please use the `{{@site.name}}js` tag in questions)
* **Gitter** Discuss {{@site.name}} with us on [Gitter](https://gitter.im/{{@site.name}}/{{@site.name}})
