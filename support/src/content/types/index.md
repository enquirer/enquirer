# Prompt Type Classes

To simplify the process of creating prompts for any purpose, a handful of low-level "starter" classes are provided to serve as a starting point for creating prompts that expect a specific type of response from users.

These "starter" classes are:

- [ArrayPrompt](#arrayprompt) - create prompts that display and return an array of values.
- [BooleanPrompt](#booleanprompt) - create prompts that take and return boolean values.
- [~~DatePrompt~~](#dateprompt) - create prompts that take and return date-related values.
- [NumberPrompt](#numberprompt) - create prompts that take and return number-related values.
- [StringPrompt](#stringprompt) - create prompts that take and return strings.


## Using prompt types

```js
const BooleanPrompt = require('{%= name %}/lib/types/boolean');
// todo (simplest example for a custom boolean prompt we can think of)
```
