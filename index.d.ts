import { EventEmitter } from "events";

interface BasePromptOptions {
  name: string | (() => string)
  type: string | (() => string)
  message: string | (() => string) | (() => Promise<string>)
  initial?: any
  required?: boolean
  format?(value: string): string | Promise<string>
  result?(value: string): string | Promise<string>
  skip?: ((state: object) => boolean | Promise<boolean>) | boolean
  validate?(value: string): boolean | Promise<boolean> | string | Promise<string>
  onSubmit?(name: string, value: any, prompt: Enquirer.Prompt): boolean | Promise<boolean>
  onCancel?(name: string, value: any, prompt: Enquirer.Prompt): boolean | Promise<boolean>
  stdin?: NodeJS.ReadStream
  stdout?: NodeJS.WriteStream
}

interface Choice {
  name: string
  message?: string
  value?: string
  hint?: string
  disabled?: boolean | string
}

interface ArrayPromptOptions extends BasePromptOptions {
  type:
    | 'autocomplete'
    | 'editable'
    | 'form'
    | 'multiselect'
    | 'select'
    | 'survey'
    | 'list'
    | 'scale'
  choices: string[] | Choice[]
  maxChoices?: number
  muliple?: boolean
  initial?: number
  delay?: number
  separator?: boolean
  sort?: boolean
  linebreak?: boolean
  edgeLength?: number
  align?: 'left' | 'right'
  scroll?: boolean
}

interface BooleanPromptOptions extends BasePromptOptions {
  type: 'confirm'
  initial?: boolean
}

interface StringPromptOptions extends BasePromptOptions {
  type: 'input' | 'invisible' | 'list' | 'password' | 'text'
  initial?: string
  multiline?: boolean
}

interface NumberPromptOptions extends BasePromptOptions {
  type: 'numeral'
  min?: number
  max?: number
  delay?: number
  float?: boolean
  round?: boolean
  major?: number
  minor?: number
  initial?: number
}

interface SnippetPromptOptions extends BasePromptOptions {
  type: 'snippet'
  newline?: string
  template?: string
}

interface SortPromptOptions extends BasePromptOptions {
  type: 'sort'
  hint?: string
  drag?: boolean
  numbered?: boolean
}

type PromptOptions =
  | BasePromptOptions
  | ArrayPromptOptions
  | BooleanPromptOptions
  | StringPromptOptions
  | NumberPromptOptions
  | SnippetPromptOptions
  | SortPromptOptions

declare class BasePrompt extends EventEmitter {
    constructor(options?: PromptOptions);

    render(): void;

    run(): Promise<any>;
  }

declare class Enquirer<T = object> extends EventEmitter {
  constructor(options?: object, answers?: T);

  /**
   * Register a custom prompt type.
   *
   * @param type
   * @param fn `Prompt` class, or a function that returns a `Prompt` class.
   */
  register(
    type: string,
    fn: Enquirer.Constructor<Enquirer.Prompt> | (() => Enquirer.Constructor<Enquirer.Prompt>)
  ): this;

  /**
   * Register a custom prompt type.
   */
  register(type: Record<string, Enquirer.Constructor<Enquirer.Prompt> | (() => Enquirer.Constructor<Enquirer.Prompt>)>): this;

  /**
   * Prompt function that takes a "question" object or array of question objects,
   * and returns an object with responses from the user.
   *
   * @param questions Options objects for one or more prompts to run.
   */
  prompt(
    questions: Enquirer.Question
      | ((this: Enquirer) => Enquirer.Question)
      | (Enquirer.Question | ((this: Enquirer) => Enquirer.Question))[]
  ): Promise<Enquirer.Answers>;

  /**
   * Use an enquirer plugin.
   *
   * @param plugin Plugin function that takes an instance of Enquirer.
   */
  use(plugin: (this: this, enquirer: this) => void): this;
}

declare namespace Enquirer {
  export type Constructor<T> = new (...args: ConstructorParameters<new (...args: any) => T>) => T

  export function prompt(questions:
    | Question
    | ((this: Enquirer) => Question)
    | (Question | ((this: Enquirer) => Question))[]
  ): Promise<Answers>

  export type Answers = Record<string, Answer>
  export type Answer = string | boolean | number

  export type Question<T extends PromptValue = PromptValue> = {
    name?: string | (() => string),
    type?: string | (() => string),
    message: string | (() => string | Promise<string>),
    hint?: string
    timers?: Record<string, number | { interval?: number, frames: any[] }>,
    initial?: T | (() => Promise<T> | T),
    default?: T,
    // TODO: test is the function style needed
    skip?: boolean | ((this: Prompt, name: string | undefined, value: string | undefined) => boolean | Promise<boolean>)
    show?: boolean
    symbols?: Partial<Symbols>
    value?: T,
    format?: (this: Prompt, value: T) => any,
    result?: (this: Prompt, value: T) => any,
    validate?: (value: T) => boolean,
  }

  export type NumericQuestion = Question<number> & {
    min?: number,
    max?: number,
    delay?: number
    float?: boolean
    round?: boolean
    major?: number
    minor?: number
  }

  export namespace prompt {
    export function on(type: PromptType, handler: (p: any) => void): void
  }

  export type PromptType = string

  export type PromptValue = string | boolean | number

  export class Prompt<T extends PromptValue = PromptValue> extends EventEmitter {
    name: string | undefined
    type: string | undefined
    options: Question<T>
    symbols: Symbols
    styles: any
    timers: any
    state: State
    initial?: T | (() => T | Promise<T>)

    readonly base: Prompt
    readonly style: any
    readonly height: number
    readonly width: number
    readonly size: number
    cursor: number
    input: string
    value: T

    constructor(options?: Question<T>)
    alert(): void

    body(): null | string

    cancel(err: any): void;

    clear(lines: number): void;

    close(): void;

    cursorHide(): void

    cursorShow(): void

    element(name: string, choice: string[] | undefined, i: number): Promise<string>

    error<E>(err: E): E | string

    footer(): Promise<string>

    format(value: T): string

    header(): Promise<string>

    hint(): Promise<string>

    indicator(choice: string | undefined, i: number): Promise<string>;

    initialize(): void;

    isValue(value: any): boolean

    keypress(input: string | number | null, modifiers?: Key): Promise<void>

    message(): Promise<string>;

    pointer(choice: string[] | undefined, i: number): Promise<string>

    prefix(): Promise<string>;

    render(): void;

    resolve(value: ((this: Prompt, ...args: any[]) => any) | any, ...args: any[]): any;

    restore(): void;

    result(value: T): string

    run(): Promise<T>;

    sections(): { header: string, prompt: string, after: string, rest: string[], last: string };

    separator(): Promise<string>;

    skip(): boolean

    start(): void;

    submit(value?: any): void;

    validate(value: T): boolean

    write(string: string): void;
  }

  export namespace Prompt {

    export function prompt<T extends PromptValue = PromptValue>(): (options: Question<T>) => Promise<any>;
  }

  export class State {
    type: string
    name: string
    message: string
    header: string
    footer: string
    error: string
    hint: string
    input: string
    cursor: number
    index: number
    lines: number
    tick: number
    prompt: string
    buffer: string
    width: number
    symbols: any
    styles: any
    required: typeof Set
    cancelled: boolean
    submitted: boolean
    loading: boolean | 'choices'
    readonly status: 'pending' | 'cancelled' | 'submitted'

    clone(): Omit<State, 'clone' | 'buffer'> & { buffer: Buffer }

    color: Function | any
  }

  export type Symbols = {
    indicator: string,
    check: string,
    prefix: string,
    separator: string,
    [k: string]: string
  } & SymbolsType

  export class Input extends Prompt { }

  export namespace prompts {
    export class AutoComplete extends Prompt { }
    export class BasicAuth extends Prompt { }
    export class Confirm extends Prompt { }
    export class Editable extends Prompt { }
    export class Form extends Prompt { }
    export class Input extends Prompt { }
    export class Invisible extends Prompt { }
    export class List extends Prompt { }
    export class MultiSelect extends Prompt { }
    export const Numeral: typeof types.NumberPrompt
    export class Password extends Prompt { }
    export class Quiz extends Prompt { }
    export class Scale extends Prompt { }
    export class Select extends Prompt { }
    export class Snippet extends Prompt { }
    export class Sort extends Prompt { }
    export class Survey extends Prompt { }
    export const Text: typeof Input
    export class Toggle extends Prompt { }
  }

  export namespace types {
    export class ArrayPrompt extends Prompt { }
    export class AuthPrompt extends Prompt { }
    export class BooleanPrompt extends Prompt<boolean> { }
    export class NumberPrompt extends Prompt<number> {
      min: number
      max: number
      delay: number
      float: boolean
      round: boolean
      major: number
      minor: number
      constructor(question: NumericQuestion)
    }
    export class StringPrompt extends Prompt<string> {
      moveCursor(n: number): void
      reset(): Promise<any>
      dispatch(ch: string, key: Key): void
      append(ch: string): void
      insert(str: string): void
      delete(): void
      deleteForward(): void
      cutForward(): void
      cutLeft(): void
      paste(): void
      toggleCursor(): void
      first(): void
      last(): void
      next(): void
      prev(): void
      backward(): void
      forward(): void
      right(): void
      left(): void
    }
  }

  export type Key = {
    ctrl?: boolean
    code?: number
    name?: string
  }


  // export class PromptOld extends BasePrompt { }

  // export interface BasePromptOptions {
  //   name: string | (() => string)
  //   type: string | (() => string)
  //   message: string | (() => string) | (() => Promise<string>)
  //   initial?: any
  //   required?: boolean
  //   format?(value: string): string | Promise<string>
  //   result?(value: string): string | Promise<string>
  //   skip?: ((state: object) => boolean | Promise<boolean>) | boolean
  //   validate?(value: string): boolean | Promise<boolean> | string | Promise<string>
  //   onSubmit?(name: string, value: any, prompt: Enquirer.PromptOld): boolean | Promise<boolean>
  //   onCancel?(name: string, value: any, prompt: Enquirer.PromptOld): boolean | Promise<boolean>
  //   stdin?: ReadStream
  //   stdout?: WriteStream
  // }

  // export interface ChoiceOld {
  //   name: string
  //   message?: string
  //   value?: string
  //   hint?: string
  //   disabled?: boolean | string
  // }

  // export interface ArrayPromptOptions extends BasePromptOptions {
  //   type:
  //   | 'autocomplete'
  //   | 'editable'
  //   | 'form'
  //   | 'multiselect'
  //   | 'select'
  //   | 'survey'
  //   | 'list'
  //   | 'scale'
  //   choices: string[] | ChoiceOld[]
  //   maxChoices?: number
  //   muliple?: boolean
  //   initial?: number
  //   delay?: number
  //   separator?: boolean
  //   sort?: boolean
  //   linebreak?: boolean
  //   edgeLength?: number
  //   align?: 'left' | 'right'
  //   scroll?: boolean
  // }

  // export interface BooleanPromptOptions extends BasePromptOptions {
  //   type: 'confirm'
  //   initial?: boolean
  // }

  // export interface StringPromptOptions extends BasePromptOptions {
  //   type: 'input' | 'invisible' | 'list' | 'password' | 'text'
  //   initial?: string
  //   multiline?: boolean,
  //   show?: boolean
  // }

  // export interface NumberPromptOptions extends BasePromptOptions {
  //   type: 'numeral'
  //   min?: number
  //   max?: number
  //   delay?: number
  //   float?: boolean
  //   round?: boolean
  //   major?: number
  //   minor?: number
  //   initial?: number
  // }

  // export interface SnippetPromptOptions extends BasePromptOptions {
  //   type: 'snippet'
  //   newline?: string
  // }

  // export interface SortPromptOptions extends BasePromptOptions {
  //   type: 'sort'
  //   hint?: string
  //   drag?: boolean
  //   numbered?: boolean
  // }

  // export type PromptOptions =
  //   | ArrayPromptOptions
  //   | BooleanPromptOptions
  //   | StringPromptOptions
  //   | NumberPromptOptions
  //   | SnippetPromptOptions
  //   | SortPromptOptions
  //   | BasePromptOptions

  // export class BasePrompt extends EventEmitter {
  //   constructor(options?: PromptOptions);

  //   render(): void;

  //   run(): Promise<any>;
  // }
  // export class Input extends BasePrompt { }

}

export = Enquirer
