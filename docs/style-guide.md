# Prompt Style Guide

- [Overview](#overview)
- [Layout](#layout)
- [Semantic Styles](#semantic-styles)

## Overview

**Developer Experience (DX)**

Whatever you're building, stop and ask yourself the following question: "How do I want my users to 'feel'?". 

Happy? Alert? Satisfied? Nothing at all?

Connect with your users.
Hold their attention.
Drive decisions.

We don't have much room to work with.

Use whitespace when possible.
Be concise when necessary.
Reduce clutter.
Use contrasting colors, shapes, and sizes.
Use whitespace and visual breaks to prevent pattern blindness.

Exacting Communication
Emotional response

When creating prompts, our goal, _as developers and implementors_, is to provide our users with the best experience possible. When designing user interfaces for the command line in particular, the best experience is typically one that enables a task to be accomplished in the most efficient and effective way possible.

Web developers understand the 

good user interface design aims to foretell the users what they need to do when approaching an interface. In simple words, a great user interface design is one that helps users accomplish


The most important  is maintaining visual consistency in how the elements are placed in a web design’s UI. That’s because the lack of consistency in your user interface design can make your interface look and feel

chaotic and confusing to the viewer. On the other hand, maintaining visual consistency can help users to easily communicate with your system.


## Semantic Styles

Enquirer's built-in styling system has one simple goal: _to help you maintain visual consistency across your prompts_. This not only provides for a better developer and user experience, but it also makes styling easier to customize. 

adhering to a system has the additional 

makes it easy to customize colors, while also maintaining

This provides for a better experience. 

**Expressive**



**Strive for consistency** 

simplify 

presentation

style

elegance

Enquirer uses a carefully selected palette of semantic styles 

Semantic styles  clearly describes its meaning to both the user and the developer. 

### Main palette

| **Style Name** | **Default Color** | **Description** |
| --- | --- | --- |
| `primary`  | ANSI `cyan`     | The `primary` style is main accent color used throughout the prompt. |
| `info`     | `primary`       | Used to denote information that is neutral. |
| `success`  | ANSI `green`    | Used to indicate success, like with checked choices and radio buttons. |
| `danger`   | ANSI `magenta`  | Used when it's necessary to get the user's attention, like error messages. |
| `warning`  | ANSI `yellow`   | Used to get the user's attention, in a slightly more subtle way than `danger`. |
| `strong`   | ANSI `bold`     | Used to emphasize text, such as the prompt message. |
| `muted`    | ANSI `dim`      | For hints or other subtle text. |
| `disabled` | ANSI `gray`     | For disabled prompt elements. |
| `dark`     | ANSI `dim.gray` | For inactive prompt elements. |

### Modifiers

| **Style Name** | **Default Color** | **Description** |
| --- | --- | --- |
| `inverse`       | Inverse of `primary` | Attempts to the _inverse_ of `primary`. For example, if `primary` is cyan, `inverse` will be `bgCyan` with black text. Override this color if it doesn't work well with your custom palette. |
| `complement`    | Complement of `primary` | Attempts to use approximately the opposite of `primary` on the color wheel. Override this color if it doesn't work well with your custom palette. |

### Statuses

Enquirer prompts only have three possible statuses: `pending` (still in session), `submitted` (sucessfully completed), and `cancelled` (terminated by the user). You can get the status of a prompt at any time using the `prompt.status` property (getter).

The following styles were added as a convenience to help you easily get an appropriate style to use based on the prompt's status.

| **Style Name** | **Default Color** | **Description** |
| --- | --- | --- |
| `pending`   | `info` | Denotes that a prompt session is still active and has not been cancelled or submitted. |
| `submitted` | `success` | Denotes that the user has successfully submitted an "answer". |
| `cancelled` | `danger`  | Denotes that the user has terminated the prompt session. |

#### Example usage

```js
const style = prompt.styles[prompt.status];
const prefix = prompt.symbols.prefix[prompt.status];
console.log(style(prefix));

// the above is roughly equivalent to the following
console.log(prompt.styles.pending('?'));
console.log(prompt.styles.submitted('√'));
console.log(prompt.styles.cancelled('✖'));
```

### Special Styles

| **Style Name** | **Default Color** | **Description** |
| --- | --- | --- |
| `heading`     | `primary.underline` |  |
| `placeholder` | `primary.dim`       |  |
| `highlight`   | `inverse`           |  |
