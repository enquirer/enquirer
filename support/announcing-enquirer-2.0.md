# Announcing Enquirer 2.0!

This version of Enquirer is a complete overhaul, not only in terms of how prompts are written and handled but also in terms of our philosophy for creating and maintaining prompts.

## TLDR;

- Enquirer 2.0 will ship with several built-in prompts (some prompt libraries will be deprecated)
- Semantic styling system that makes colors and symbols easier than every to customize
- Only one dependency!
- Easier to customize and use
- New prompt types
- New features

- Stylish CLI prompts that are user-friendly and easy to create.
- Prompts should be more like a conversation than an inquisition.
- Enquirer is fast, lightweight, and easy enough to use on small projects, while also being powerful and customizable enough for the most advanced use cases.
- Stylish and user-friendly prompt system. Fast and lightweight enough for small projects, yet powerful and extensible enough for the most advanced use cases.

**What's changing in Enquirer 2.0?**

- Several prompts that were previously published as individual packages will be included in Enquirer itself. As uses, we didn't like having to add commonly-used prompts as plugins. Enquirer 2.0 will still support custom prompts, but many prompts will also be built-in.
- Enquirer will only have a single dependency, https://github.com/doowb/ansi-colors, which itself has no other dependencies). This will make Enquirer easier to maintain and faster for users.
- Methods for registering "questions" have been removed. While it was nice to be able to preregister questions that could be called upon later, this is something that is better left to implementors, as it's relatively trivial to do with custom code.

**What's new in Enquirer 2.0?**

A lot!  Several exciting new prompt types and useful features have been added, including:

- Easier to use - Prompts are easy to create, run, and use with very little code or setup.
- Dynamic - Enquirer 2.0 uses promises and async/await to make it drop-dead simple to compose, chain and stack prompts to create more sophisticated conversations with users. Moreover, prompt messages, styles, and symbols can be dynamically applied - sync or async - based on prompt status or any other conditions.
- Progressive disclosure - Users and implementors can quickly get started and create prompts without having to learn a complicated API. Methods, options and more advanced features are available for users who need them.
- New semantic styling system - Colors are applied consistently throughout prompts using a palette of semantically named styles. Easily override the defaults with custom colors, symbols, and text on any part of any prompt. Styles can be customized a-la-carte, or all at once on the options.
- Elements - Each part of a prompt is
- Multi-language support
- , with semantic styles, elements, symbols, and themes!


New Prompt Types

Even when you only need to ask for a single piece of information, prompts should be more like conversations than interrogations. Enquirer 2.0 introduces new prompt concepts that will make it easier to have conversations with users by achieving the following goals:

- Like web forms, users should be able to provide multiple pieces of information at once, allowing them to tab through fields, make changes, and advance at their own pace before submitting their information.
- By simplifying this process, prompt implementors will be able to spend more time thinking about how to communicate with uses, and less time worrying about setup, writing code, and implementation details.


 - Stying

We put a lot of thought and effort into styling. Our goals were the following:

1. Make styling as customizable as possible
1. Consistently apply styles throughout the prompts
1. User-friendly for prompt implementors and end-users.

I think we accomplished all of these goals! Keep reading to learn how we made styling easier in Enquirer 2.0!

**Semantic styles**

Enquirer 2.0 has a has a built-in "palette" of semantically named styles, which are used consistently throughout the prompts. These styles are `prompt.styles`


**Palette**

- `info` - cyan
- `danger` - red
- `strong` - bold
- `success` - green
- `warning` - yellow
- `disabled` - gray
- `muted` - dim
- `dark` - dim.gray

- Elements - The various parts of prompt are called "elements".
- Customizable - It's now super easy to apply custom styles, text or Unicode symbols to any part of a prompt.
- Themes -

