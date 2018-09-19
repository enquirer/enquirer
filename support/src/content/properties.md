# Properties

## Prototype methods

todo

## Instance properties

- `prompt.choices` - Normalized array of choices created from `options.choices`.
- `prompt.visible` - Visible list of choices, if `options.limit` is defined, or the entire choices array.
- `prompt.index` - The index of the choice that currently has focus.
- `prompt.focused` - The choice that has focus.


- `prompt.input` - `process.stdin` by default, or `options.input`
- `prompt.output` - `process.stdout` by default, or `options.output`
- `prompt.rl` - readline interface, created with `prompt.input` and `prompt.output`.

## Static properties

todo

## Static methods

todo

### Self-referencing

All prompt classes are exposed as static methods on themselves so that inheriting classes can easily access that specific class and its properties, regardless of how many ancestors are in the prototype chain.

Example:

```js
class MultiSelect {
  static get MultiSelect() {
    return MultiSelect;
  }
}

class SomePrompt extends MultiSelect {}
class OtherPrompt extends SomePrompt {}

console.log(OtherPrompt.MultiSelect === MultiSelect); // true
```

