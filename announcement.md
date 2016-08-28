
/**
 * TODO:
 * - ask: return promise?
 * - ask: add answers to `this.cache.answers`
 * - expose array of common questions
 * - emit ask/answer events from enquirer
 * - `enquirer-mock` (doowb)
 * -
 */

When we decided to create generate, we felt that it was really important to get prompts perfect. We haven't achieved this yet, but we will. Here is how we plan to improve prompts in the near future:

## Prompts

> flow control, terminal rendering, user interactions and user experience as it relates to prompt sessions

Making prompts fast, easy to use, and easy to customize, makes them... well, more likely to be used and customized.

Here is how we plan to improve prompts:

- [ ] **Faster, lighter, prompts**. To achieve this, we need a new prompt library. Inquirer adds 120ms to the load time of micro-generators that would otherwise take 3-5 ms.<sup>[1](#load-times)</sup>
- [ ] **Modular prompts**. It should be lighter and easier to use (or create) custom prompt types<sup>[2](#custom-prompts)</sup>

## Questions

> actual "question" objects, which consist of a question `name`, `message`, prompt `type`, and other properties necessary for validating answers, setting default values, and so on.

Controlling flow is only part of the equation. We we also want to reduce boilerplate associated with asking "common questions". For example,

## Answers

>

- [ ] **Smarter defaults**
- [ ] **More reliable caching**
- [ ] **User-defined persisting**

For example, you can "chain" generators in the command line:

```sh
$ gen
```


1. **Chained generators**:
1. **Persisted answers**.
1. **Smarter defaults for "common questions"**.  There are only a handful of questions that are fairly


<a name="load-times">1</a>: This is a barrier to making prompts feel like conversations. We can do better.
<a name="custom-prompts">2</a>: Currently, using a custom prompt type like [inquirer-autocomplete-prompt](https://www.npmjs.com/package/inquirer-autocomplete-prompt) (which is awesome btw) adds its own instance of Inquirer, in addition to one that already may already exist - and might be a different version. In some cases I've measured this adding up to 200ms to load time!?! This is a "human-measurable" timescale. meaning, _you will notice the lag_, like waiting for a page to refresh in the browser - not as long but in the console it feels longer.

[par]: http://idioms.thefreedictionary.com/par+for+the+course
