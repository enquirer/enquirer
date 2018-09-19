# Enquirer


## Performance

**Library** | **Load time**
--- | ---
[enquirer][] | `5.190ms`
[inquirer][] | `254.054ms`
[prompts][]  | `14.236ms`

### Prompts

All prompt classes may be accessed as static properties.

**Example**

```js
const Enquirer = require('enquirer');
const { Select, Multiselect } = Enquirer;
```



**Example**

```js
const prompt = new Prompt({ name: 'username', message: 'What is your username?' });
const keypresses = [];
prompt.on('keypress', (s, key) => keypresses.push(key));

prompt.run()
  .then(() => console.log(keypresses))
  .catch(console.log);
```

## API

## Base types

- Array prompts
- Boolean prompts
- Number prompts
- String prompts
- ~~Date prompts~~ todo


## Array prompts
## Boolean prompts
## Date prompts
## Number prompts
## String prompts

### Instance properties

- `prompt.cursor` - the position of the cursor in the `prompt.typed` string.

### Methods

***

## options.header

Major positions

```
header
prefix message separator input suffix
body
footer
```

```
header
prefix message separator input suffix
- prefix message separator input suffix
- prefix message separator input suffix
- prefix message separator input suffix
- prefix message separator input suffix
footer
```

- `header`
- `prefix`
- `message`
- `separator`
- `input`
- `suffix`
- `footer`


## Examples

### Header

Disply a [header](#optionsheader) before your prompt.

```
     _-----_
    |       |    ╭──────────────────────────╮
    |--(o)--|    │   Welcome to my awesome  │
   `---------´   │        generator!        │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `

? Pick a color … (Use arrow keys, press <return> to submit)
❯ [x] Red
      Green
      Blue
(Move up and down to reveal more choices)
```



```
     _-----_
    |       |    ╭──────────────────────────╮
    |--(o)--|    │   Welcome to my awesome  │
   `---------´   │        generator!        │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `

? Pick a color … Something typed (Use arrow keys, press <return> to submit)
❯ Red (this is a an error!)
  Green (this is a hint!)
  Blue
(Move up and down to reveal more choices)
```
