import { SymbolsType } from 'ansi-colors';
import { EventEmitter } from 'events';

declare class Enquirer extends EventEmitter {
  constructor(options?: any, answers?: Enquirer.Answers);

  /**
   * Register a custom prompt type.
   *
   * @param type
   * @param fn `Prompt` class, or a function that returns a `Prompt` class.
   */
  register(
    type: string,
    fn: Enquirer.Constructor<Enquirer.Prompt<any>> | (() => Enquirer.Constructor<Enquirer.Prompt<any>>),
  ): this;

  /**
   * Register a custom prompt type.
   */
  register(type: Record<string, Enquirer.Constructor<Enquirer.Prompt<any>> | (() => Enquirer.Constructor<Enquirer.Prompt<any>>)>): this;

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
  export type Constructor<T extends Prompt> = new (...args: ConstructorParameters<new (...args: any) => T>) => T

  export function prompt(questions:
    | Question
    | ((this: Enquirer) => Question)
    | (Question | ((this: Enquirer) => Question))[]
  ): Promise<Answers>

  export type Answers = Record<string, Answer>
  export type Answer = string | boolean | number | string[]

  export type Question<T extends Answer = Answer> = {
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
    format?: (this: Prompt<T>, value: T) => any,
    result?: (this: Prompt<T>, value: T) => any,
    validate?: (value: T) => boolean,
  }

  export type NumericQuestion = Question<number> & {
    min?: number,
    max?: number,
    delay?: number,
    float?: boolean,
    round?: boolean,
    major?: number,
    minor?: number,
  }

  export type ArrayQuestion = Question<any> & {
    choices: ChoiceInput[] | Promise<ChoiceInput[]>;
    autofocus?: number | string;
    multiple?: boolean;
  }

  export type ChoiceInput = string | Promise<string> | Choice | (() => string | Promise<string>)

  export type Choice = {
    name: string;
    message?: string;
    hint?: string;
    disabled?: boolean;
    value?: Answer;
  }

  export namespace prompt {
    export function on(type: PromptType, handler: (p: any) => void): void
  }

  export type PromptType = string

  export class Prompt<T extends Answer = Answer> extends EventEmitter {
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

    constructor(options: Question<T>)

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

    submit(value?: any): Promise<void>;

    validate(value: T): boolean

    write(string: string): void;
  }

  export namespace Prompt {

    export function prompt<T extends Answer = Answer>(): (options: Question<T>) => Promise<any>;
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
    indicator: string;
    check: string;
    prefix: string;
    separator: string;
    [k: string]: string;
  } & SymbolsType;

  export type Action = 'prev' | 'undo' | 'next' | 'redo' | 'save' | 'remove'

  export namespace prompts {
    export class AutoComplete extends Prompt { }
    export class BasicAuth extends Prompt { }
    export class Confirm extends BooleanPrompt { }
    export class Editable extends Prompt { }
    export class Form extends Prompt { }
    export class Input extends StringPrompt {
      altDown(): Promise<void>;

      altUp(): Promise<void>;

      completion(action: Action): Promise<void>;

      prev(): void;

      save(): void;

      submit(): Promise<void>;
    }
    export class Invisible extends StringPrompt {
      format(): string;
    }
    export class List extends Prompt<string[]> {
      constructor(question: Omit<Question<string[]>, 'initial'> & {
        initial?: string,
        separator?: string | RegExp
      })
      format(): string;
      split(input?: string): string[];
      submit(): Promise<void>;
    }
    export class MultiSelect extends Prompt { }
    export const Numeral: typeof types.NumberPrompt
    export type Numeral = types.NumberPrompt
    export class Password extends StringPrompt { }
    export class Quiz extends Prompt { }
    export class Scale extends Prompt { }
    export class Select extends ArrayPrompt {
      dispatch(ch?: string, key?: Key): Promise<void>;

      choiceMessage(choice: Choice, i: number): string;
      choiceSeparator(): string;
      renderChoice(choice: Choice, i: number): Promise<string>;
      renderChoices(): Promise<string>
    }
    export class Snippet extends Prompt { }
    export class Sort extends Prompt { }
    export class Survey extends Prompt { }
    export const Text: typeof Input
    export type Text = Input
    export class Toggle extends Prompt { }
  }

  export const AutoComplete: typeof prompts.AutoComplete
  export const BasicAuth: typeof prompts.BasicAuth
  export const Confirm: typeof prompts.Confirm
  export const Editable: typeof prompts.Editable
  export const Form: typeof prompts.Form
  export const Input: typeof prompts.Input
  export const Invisible: typeof prompts.Invisible
  export const List: typeof prompts.List
  export const MultiSelect: typeof prompts.MultiSelect
  export const Numeral: typeof prompts.Numeral
  export const Password: typeof prompts.Password
  export const Quiz: typeof prompts.Quiz
  export const Scale: typeof prompts.Scale
  export const Select: typeof prompts.Select
  export const Snippet: typeof prompts.Snippet
  export const Sort: typeof prompts.Sort
  export const Survey: typeof prompts.Survey
  export const Text: typeof prompts.Text
  export const Toggle: typeof prompts.Toggle

  export type AutoComplete = prompts.AutoComplete
  export type BasicAuth = prompts.BasicAuth
  export type Confirm = prompts.Confirm
  export type Editable = prompts.Editable
  export type Form = prompts.Form
  export type Input = prompts.Input
  export type Invisible = prompts.Invisible
  export type List = prompts.List
  export type MultiSelect = prompts.MultiSelect
  export type Numeral = prompts.Numeral
  export type Password = prompts.Password
  export type Quiz = prompts.Quiz
  export type Scale = prompts.Scale
  export type Select = prompts.Select
  export type Snippet = prompts.Snippet
  export type Sort = prompts.Sort
  export type Survey = prompts.Survey
  export type Text = prompts.Text
  export type Toggle = prompts.Toggle

  export const autocomplete: AutoComplete
  export const basicauth: BasicAuth
  export const confirm: Confirm
  export const editable: Editable
  export const form: Form
  export const input: Input
  export const invisible: Invisible
  export const list: List
  export const multiselect: MultiSelect
  export const numeral: Numeral
  export const password: Password
  export const quiz: Quiz
  export const scale: Scale
  export const select: Select
  export const snippet: Snippet
  export const sort: Sort
  export const survey: Survey
  export const text: Text
  export const toggle: Toggle

  export namespace types {
    export class ArrayPrompt extends Prompt {
      choices: Choice[]
      readonly enabled: Choice[]
      readonly focused: Choice | undefined
      index: number
      limit: number
      readonly selectable: Choice[]
      readonly selected: Choice | Choice[]
      visible: Choice

      constructor(question: ArrayQuestion)

      a(): Promise<void>

      addChoice(element: string |
        ((this: ArrayPrompt, arg: ArrayPrompt) => Promise<Choice>) |
        Promise<Choice> |
        Choice, i: number, parent: Choice): Promise<Choice>;

      disable(choice: Choice): Choice;

      dispatch(ch?: string, key?: Key): void

      down(): Promise<void>;

      enable(choice: Choice): Choice | undefined;

      end(): Promise<void>;

      filter(value: string | number | ((choice: Choice) => boolean)): Choice;
      filter<P extends keyof Choice>(value: string | number | ((choice: Choice) => boolean), prop: P): Choice[P];

      find(value: string | number | ((choice: Choice) => boolean)): Choice;
      find<P extends keyof Choice>(value: string | number | ((choice: Choice) => boolean), prop: P): Choice[P];

      findIndex(value: string | number | ((choice: Choice) => boolean)): number;

      first(): Promise<void>;

      focus(choice: Choice, enabled?: boolean): Choice;

      g(choice?: Choice): Promise<void>;

      home(): Promise<void>;

      i(): Promise<void>;

      indent(choice: Choice): string;

      initialize(): Promise<void>;

      isChoice(choice: Choice, value: string | number): boolean;

      isDisabled(choice?: Choice): boolean;

      isEnabled(choice?: Choice): boolean;

      isSelected(choice: Choice): boolean;

      last(): Promise<void>;

      left(): Promise<void>;

      map<P extends keyof Choice = 'value'>(names?: string[], prop?: P): Record<string, Choice[P]>

      newItem(element: Partial<Choice>, i: number, parent: Choice): Promise<void>;

      next(): Promise<void>;

      number(n: string | number): Promise<number | undefined>;

      onChoice(choice: Choice, i: number): Promise<void>;

      pageDown(): Promise<void>;

      pageUp(): Promise<void>;

      prev(): Promise<void>;

      reset(): Promise<void>;

      right(): Promise<void>;

      scrollDown(i?: number): Promise<void>;

      scrollUp(i?: number): Promise<void>;

      shiftDown(): Promise<void>;

      shiftUp(): Promise<void>;

      space(): Promise<void>;

      submit(): Promise<void>;

      swap(pos: number): void;

      toChoice(element: string |
        ((this: ArrayPrompt, arg: ArrayPrompt) => Promise<Choice>) |
        Promise<Choice> |
        Choice, i: number, parent: Choice): Promise<Choice>;

      toChoices(value: any, parent: any): Promise<Choice>

      toggle(choice: Choice, enabled: boolean): Choice | undefined;

      up(): Promise<void>;
    }

    export class AuthPrompt extends Prompt { }
    export class BooleanPrompt extends Prompt<boolean> {
      default: string
      constructor(question: Omit<Question<boolean>, 'initial' | 'default'> & {
        initial?: string | boolean | (() => string | boolean | Promise<string | boolean>);
        default?: string;
        isTrue?: (input: boolean | string) => boolean;
        isFalse?: (input: boolean | string) => boolean;
      })

      isTrue(input: boolean | string): boolean;
      isFalse(input: boolean | string): boolean;
    }
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
      constructor(question: Question<string> & { multiline?: boolean })
      append(ch: string): void;
      backward(): void;
      cutForward(): void;
      cutLeft(): void;
      delete(): void;
      deleteForward(): void;
      dispatch(ch?: string, key?: Key): void;
      first(): void;
      forward(): void;
      format(value?: string): string;
      insert(str: string): void;
      last(): void;
      left(): void;
      moveCursor(n: number): void;
      next(): void;
      paste(): void;
      prev(): void;
      reset(): Promise<any>;
      right(): void;
      toggleCursor(): void;
    }
  }

  export const ArrayPrompt: typeof types.ArrayPrompt;
  export type ArrayPrompt = types.ArrayPrompt;
  export const StringPrompt: typeof types.StringPrompt;
  export type StringPrompt = types.StringPrompt;
  export const NumberPrompt: typeof types.NumberPrompt;
  export type NumberPrompt = types.NumberPrompt;
  export const BooleanPrompt: typeof types.BooleanPrompt;
  export type BooleanPrompt = types.BooleanPrompt;
  export const AuthPrompt: typeof types.AuthPrompt;
  export type AuthPrompt = types.AuthPrompt;

  export type Key = {
    name?: string;
    code?: string;
    sequence?: string;
    ctrl?: boolean;
    shift?: boolean;
    fn?: boolean;
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
