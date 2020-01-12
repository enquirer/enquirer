import { EventEmitter } from 'events';
import { ReadStream, WriteStream } from 'tty';

declare class Enquirer<T = any> extends EventEmitter {
  constructor(options?: any, answers?: T);

  /**
   * Register a custom prompt type.
   *
   * @param type
   * @param fn `Prompt` class, or a function that returns a `Prompt` class.
   */
  register(type: string, fn: typeof Enquirer.BasePrompt | (() => typeof Enquirer.BasePrompt)): this;

  /**
   * Register a custom prompt type.
   */
  register(type: { [key: string]: typeof Enquirer.BasePrompt | (() => typeof Enquirer.BasePrompt) }): this;

  /**
   * Prompt function that takes a "question" object or array of question objects,
   * and returns an object with responses from the user.
   *
   * @param questions Options objects for one or more prompts to run.
   */
  prompt(
    questions:
      | Enquirer.PromptOptions
      | ((this: Enquirer) => Enquirer.PromptOptions)
      | (Enquirer.PromptOptions | ((this: Enquirer) => Enquirer.PromptOptions))[]
  ): Promise<T>;

  /**
   * Use an enquirer plugin.
   *
   * @param plugin Plugin function that takes an instance of Enquirer.
   */
  use(plugin: (this: this, enquirer: this) => void): this;
}

declare namespace Enquirer {
  export type PromptType = string

  export type PromptValue = string | boolean | number

  export class Prompt extends EventEmitter {
    name: string | undefined
    type: string | undefined
    options: Prompt.Options
    symbols: any
    styles: any
    timers: any
    state: State
    initial?: any

    readonly base: Prompt
    readonly style: any
    readonly height: number
    readonly width: number
    readonly size: number
    cursor: number
    input: string
    value: string

    constructor(options?: Prompt.Options)
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

    format(value: string): string

    header(): Promise<string>

    hint(): Promise<string>

    indicator(choice: string | undefined, i: number): Promise<string>;

    initialize(): void;

    isValue(value: any): boolean

    keypress(input: string | number, event?: object): Promise<void>

    message(): Promise<string>;

    pointer(choice: string[] | undefined, i: number): Promise<string>

    prefix(): Promise<string>;

    render(): void;

    resolve(value: ((this: Prompt, ...args: any[]) => any) | any, ...args: any[]): any;

    restore(): void;

    result(value: string): string

    run(): Promise<any>;

    sections(): { header: string, prompt: string, after: string, rest: string[], last: string };

    separator(): Promise<string>;

    skip(): boolean

    start(): void;

    submit(value?: any): void;

    validate(value: any): boolean

    write(string: string): void;
  }

  export namespace Prompt {
    export type Options = {
      name?: string,
      type?: string,
      timers?: Record<string, number | { interval?: number, frames: any[] }>,
      initial?: string,
      default?: string,
      skip?: boolean | ((this: Prompt, name: string | undefined, value: string | undefined) => boolean)
      show?: boolean
      message?: string,
      symbols?: Partial<Symbols>
      value?: PromptValue,
      format?: (value: PromptValue) => any,
      result?: (value: PromptValue) => any,
      validate?: (value: PromptValue) => boolean
    }

    export function prompt(): (options: Prompt.Options) => Promise<any>;

    export type Symbols = {
      indicator: string,
      check: string,
      prefix: string,
      separator: string,
      [k: string]: string
    }
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

  export function prompt<T = any>(questions:
    | PromptOptions
    | ((this: Enquirer) => PromptOptions)
    | (PromptOptions | ((this: Enquirer) => PromptOptions))[]
  ): Promise<T>

  export namespace prompt {
    export function on(type: PromptType, handler: (p: any) => void): void
  }

  export class PromptOld extends BasePrompt { }

  export interface BasePromptOptions {
    name: string | (() => string)
    type: string | (() => string)
    message: string | (() => string) | (() => Promise<string>)
    initial?: any
    required?: boolean
    format?(value: string): string | Promise<string>
    result?(value: string): string | Promise<string>
    skip?: ((state: object) => boolean | Promise<boolean>) | boolean
    validate?(value: string): boolean | Promise<boolean> | string | Promise<string>
    onSubmit?(name: string, value: any, prompt: Enquirer.PromptOld): boolean | Promise<boolean>
    onCancel?(name: string, value: any, prompt: Enquirer.PromptOld): boolean | Promise<boolean>
    stdin?: ReadStream
    stdout?: WriteStream
  }

  export interface ChoiceOld {
    name: string
    message?: string
    value?: string
    hint?: string
    disabled?: boolean | string
  }

  export interface ArrayPromptOptions extends BasePromptOptions {
    type:
    | 'autocomplete'
    | 'editable'
    | 'form'
    | 'multiselect'
    | 'select'
    | 'survey'
    | 'list'
    | 'scale'
    choices: string[] | ChoiceOld[]
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

  export interface BooleanPromptOptions extends BasePromptOptions {
    type: 'confirm'
    initial?: boolean
  }

  export interface StringPromptOptions extends BasePromptOptions {
    type: 'input' | 'invisible' | 'list' | 'password' | 'text'
    initial?: string
    multiline?: boolean,
    show?: boolean
  }

  export interface NumberPromptOptions extends BasePromptOptions {
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

  export interface SnippetPromptOptions extends BasePromptOptions {
    type: 'snippet'
    newline?: string
  }

  export interface SortPromptOptions extends BasePromptOptions {
    type: 'sort'
    hint?: string
    drag?: boolean
    numbered?: boolean
  }

  export type PromptOptions =
    | ArrayPromptOptions
    | BooleanPromptOptions
    | StringPromptOptions
    | NumberPromptOptions
    | SnippetPromptOptions
    | SortPromptOptions
    | BasePromptOptions

  export class BasePrompt extends EventEmitter {
    constructor(options?: PromptOptions);

    render(): void;

    run(): Promise<any>;
  }
  export class Input extends BasePrompt { }

}

export = Enquirer
