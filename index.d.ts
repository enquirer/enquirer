<<<<<<< HEAD
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
=======
import { SymbolsType } from 'ansi-colors';
import { EventEmitter } from 'events';
>>>>>>> fix: add Input type

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
    questions: Enquirer.Prompt.Question
      | ((this: Enquirer) => Enquirer.Prompt.Question)
      | (Enquirer.Prompt.Question | ((this: Enquirer) => Enquirer.Prompt.Question))[]
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

  export function prompt(questions: prompt.Question
    // | ((this: Enquirer) => Prompt.Question)
    // | (Prompt.Question | ((this: Enquirer) => Prompt.Question))[]
  ): Promise<Answers>

  export namespace prompt {
    export function on(type: PromptType, handler: (p: Prompt<any>) => void): void

    export type Question = InputQuestion | ConfirmQuestion | NumeralQuestion |
      PasswordQuestion | InvisibleQuestion | ListQuestion | ToggleQuestion | BasicAuthQuestion |
      QuizQuestion | ScaleQuestion | SortQuestion | SnippetQuestion | SelectQuestion

    export type InputQuestion = { type: 'input' } &
      internalTypes.CommonQuestion<string, string>

    export type ConfirmQuestion = { type: 'confirm' } &
      internalTypes.CommonQuestion<boolean, boolean>

    export type NumeralQuestion = { type: 'numeral' } &
      internalTypes.CommonQuestion<number, number>

    export type PasswordQuestion = { type: 'password', } &
      internalTypes.CommonQuestion<string, string>

    export type InvisibleQuestion = { type: 'invisible', } &
      internalTypes.CommonQuestion<string, string>

    export type ListQuestion = { type: 'list' } &
      internalTypes.QuestionBase &
      internalTypes.Initializer<string | string[], string[]> &
      internalTypes.Formatter<string, string[]> &
      internalTypes.Validator<string[], string[]> &
      internalTypes.ResultTransformer<string[], string[]>

    export type ToggleQuestion = {
      type: 'toggle',
      enabled?: string,
      disabled?: string,
    } & internalTypes.CommonQuestion<boolean, boolean>

    export type BasicAuthQuestion = {
      type: 'basicauth',
      username: string,
      password: string,
      showPassword?: boolean,
    } & internalTypes.QuestionBase &
      internalTypes.Formatter<boolean, boolean> &
      internalTypes.Validator<boolean, boolean> &
      internalTypes.ResultTransformer<boolean, boolean>

    export type QuizQuestion = {
      type: 'quiz',
      choices: QuizQuestion.Choice[],
      correctChoice: number,
    } & internalTypes.QuestionBase &
      internalTypes.Formatter<boolean, QuizQuestion.Answer> &
      internalTypes.Initializer<number, QuizQuestion.Answer>

    export namespace QuizQuestion {
      export type Choice = string | Promise<string> | ChoiceOptions | (() => string | Promise<string>)
      export type ChoiceOptions = {
        // to be removed if other prompts use value consistently.
        // name: string,
        value: string,
        message?: string,
        hint?: string,
        disabled?: boolean
      }
      export type Answer = { selectedAnswer: string, correctAnswer: string, correct: boolean }
    }


    // SurveyPrompt is too alpha to be typed
    // export type SurveyQuestion = {
    //   type: 'survey',
    //   scale: { value: number, message?: string }[],
    //   margin: [number, number, number, number],
    //   choices: QuizChoice[],
    //   // initial?: number | (() => number | Promise<number>);
    // } & internalTypes.QuestionBase
    // // internalTypes.Formatter<boolean, QuizAnswer> &
    // // internalTypes.Initializer<number, QuizAnswer>

    export type ScaleQuestion = {
      type: 'scale',
      scale: { name: string, message: string }[],
      choices: ScaleQuestion.Choice[],
      margin?: number | [number, number, number, number],
    } & internalTypes.QuestionBase &
      internalTypes.Formatter<ScaleQuestion.Answer | undefined, ScaleQuestion.Answer> &
      internalTypes.ResultTransformer<ScaleQuestion.Answer, ScaleQuestion.Answer>

    export namespace ScaleQuestion {
      export type Choice = ChoiceOptions | Promise<ChoiceOptions> | (() => ChoiceOptions | Promise<ChoiceOptions>)

      export type ChoiceOptions = {
        name: string,
        message: string,
        disabled?: boolean,
        initial?: number
      }

      export type Answer = Record<string, number>
    }

    export type SortQuestion = {
      type: 'sort',
      choices: SortQuestion.Choice[],
      hint?: string,
      margin?: number | [number, number, number, number],
      numbered?: boolean,
    } & internalTypes.QuestionBase &
      internalTypes.Initializer<number, string[]> &
      internalTypes.Formatter<string[] | undefined, string[]>

    export namespace SortQuestion {
      export type Choice = ChoiceOptions | Promise<ChoiceOptions> | (() => ChoiceOptions | Promise<ChoiceOptions>)

      export type ChoiceOptions = {
        name: string,
        message: string
      }

      export type Answer = Record<string, number>
    }

    export type SnippetQuestion = {
      type: 'snippet',
      required?: boolean,
      fields?: SnippetQuestion.Field[],
    } & internalTypes.QuestionBase &
      internalTypes.Formatter<SnippetQuestion.Answer | undefined, SnippetQuestion.Answer> &
      internalTypes.Validator<SnippetQuestion.Answer, SnippetQuestion.Answer>

    export namespace SnippetQuestion {
      export type Field = {
        name: string,
        message?: string,
        initial?: string
        validate?: (value: string) => boolean | Promise<boolean>
      }

      export type Answer = {
        values: Record<string, string>,
        result: string
      }
    }

    export type SelectQuestion = {
      type: 'select',
      choices: SelectQuestion.Choice[],
    } & internalTypes.QuestionBase &
      internalTypes.Initializer<string | number, string> &
      internalTypes.Formatter<boolean, string>

    export namespace SelectQuestion {
      export type Choice = string | Promise<string> | ChoiceOptions | (() => string | Promise<string>)
      export type ChoiceOptions = {
        // to be removed if other prompts use value consistently.
        // name: string,
        value: string,
        message?: string,
        hint?: string,
        disabled?: boolean
      }
      export type Answer = { selectedAnswer: string, correctAnswer: string, correct: boolean }
    }


    export namespace internalTypes {
      export type Value = string | boolean | number | string[] |
        ScaleQuestion.Answer | SnippetQuestion.Answer

      export type CommonQuestion<V extends Value, A extends Answer> =
        QuestionBase &
        Initializer<V, A> &
        Formatter<V, A> &
        Validator<V, A> &
        ResultTransformer<V, A>

      export type QuestionBase = {
        name: string;
        message: string | (() => string | Promise<string>);

        skip?: boolean | (() => boolean | Promise<boolean>);
        show?: boolean;
      }

      export type Initializer<V extends Value, A extends Answer> = {
        initial?: V | ((this: Prompt<A>) => V | Promise<V>);
      }

      export type Formatter<V extends Value | undefined, A extends Answer> = {
        format?: (this: Prompt<A>, value: V) => string | Promise<string>;
      }

      export type Validator<V extends Value, A extends Answer> = {
        validate?: (this: Prompt<A>, value: V) => boolean | string | Promise<boolean | string>;
      }

      export type ResultTransformer<V extends Value, A extends Answer> = {
        result?: (this: Prompt<A>, value: V) => A | Promise<A>;
      }
    }
  }

  export type Answers = Record<string, Answer>
  export type Answer = string | boolean | number | string[] |
    prompt.QuizQuestion.Answer | prompt.ScaleQuestion.Answer | prompt.SnippetQuestion.Answer

  export type Key = {
    name?: string;
    code?: string;
    sequence?: string;
    ctrl?: boolean;
    shift?: boolean;
    fn?: boolean;
  }

  export type ChoiceInput = string | Promise<string> | ChoiceOptions | (() => string | Promise<string>)

  export type ChoiceOptions = {
    name?: string;
    message?: string;
    hint?: string;
    disabled?: boolean;
    value?: Answer;
  }

  export type Choice = {
    name: string;
    message: string;
    hint?: string;
    disabled?: boolean;
    value?: Answer;
  }

  export type PromptType = string

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
    _choices: Choice[]

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

  //#region Basic prompt types

  export class Prompt<T extends Answer = string> extends EventEmitter {
    name: string | undefined
    type: string | undefined
    options: Prompt.Question<T>
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

    constructor(options: Prompt.Question<T>)

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
    export function prompt<T extends Answer = string>(): (options: Question<T>) => Promise<any>;

    export type Question<T extends Answer = string, P extends Prompt<T> = Prompt<T>> = Question.Base &
    {
      initial?: T | (() => Promise<T> | T);
      default?: T;
      // TODO: test is the function style needed
      skip?: boolean | ((this: P, name: string | undefined, value: string | undefined) => boolean | Promise<boolean>);
      value?: T;
      format?: (this: P, value: T) => any;
      result?: (this: P, value: T) => any;
      validate?: (value: T) => boolean;
    }

    export namespace Question {
      export type Base = {
        name?: string | (() => string);
        type?: string | (() => string);
        header?: string;
        message: string | (() => string | Promise<string>);
        footer?: string;
        hint?: string;
        timers?: Record<string, number | { interval?: number, frames: any[] }>;
        show?: boolean;
        symbols?: Partial<Symbols>;
      }
    }
  }

  export class BooleanPrompt extends Prompt<boolean> {
    default: string
    constructor(question: BooleanPrompt.Question)
    isTrue(input: boolean | string): boolean;
    isFalse(input: boolean | string): boolean;
  }

  export namespace BooleanPrompt {
    export type Question = Omit<Prompt.Question<boolean>, 'initial' | 'default'> & {
      initial?: string | boolean | (() => string | boolean | Promise<string | boolean>);
      default?: string;
      isTrue?: (input: boolean | string) => boolean;
      isFalse?: (input: boolean | string) => boolean;
    }
  }

  export class NumberPrompt extends Prompt<number> {
    min: number
    max: number
    delay: number
    float: boolean
    round: boolean
    major: number
    minor: number
    constructor(question: NumberPrompt.Question)
  }

  export namespace NumberPrompt {
    export type Question = Prompt.Question<number> & {
      min?: number,
      max?: number,
      delay?: number,
      float?: boolean,
      round?: boolean,
      major?: number,
      minor?: number,
    }
  }

  export class StringPrompt extends Prompt<string> {
    constructor(question: StringPrompt.Question)
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

  export namespace StringPrompt {
    export type Question = Prompt.Question<string> & { multiline?: boolean }
  }

  export class AuthPrompt extends Prompt<string> { }

  export class ArrayPrompt<T extends Answer = string> extends Prompt {
    choices: Choice[]
    readonly enabled: Choice[]
    readonly focused: Choice | undefined
    index: number
    limit: number
    readonly selectable: Choice[]
    readonly selected: Choice | Choice[]
    visible: Choice

    constructor(question: ArrayPrompt.Question<T, ArrayPrompt>)

    a(): Promise<void>

    addChoice(element: string |
      ((this: ArrayPrompt<T>, arg: ArrayPrompt<T>) => Promise<Choice>) |
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
      Choice, i: number, parent?: Choice): Promise<Choice>;

    toChoices(value: any, parent?: any): Promise<Choice[]>

    toggle(choice: Choice, enabled: boolean): Choice | undefined;

    up(): Promise<void>;
  }

  export namespace ArrayPrompt {
    export type Question<T extends Answer, P extends ArrayPrompt<T> = ArrayPrompt<T>> = Prompt.Question.Base &
    {
      choices: (() => ChoiceInput[] | Promise<ChoiceInput[]>) | ChoiceInput[] | Promise<ChoiceInput[]>;
      initial?: string | number | Array<string | number> | Record<string, any>;
      autofocus?: number | string;
      multiple?: boolean;
      format?: (this: P, value: T) => any,
      result?: (this: P, value: T) => any,
    }
  }

  export namespace types {
    export const BooleanPrompt: typeof Enquirer.BooleanPrompt;
    export type BooleanPrompt = Enquirer.BooleanPrompt;

    export const NumberPrompt: typeof Enquirer.NumberPrompt;
    export type NumberPrompt = Enquirer.NumberPrompt;

    export const StringPrompt: typeof Enquirer.StringPrompt;
    export type StringPrompt = Enquirer.StringPrompt;

    export const AuthPrompt: typeof Enquirer.AuthPrompt;
    export type AuthPrompt = Enquirer.AuthPrompt;

    export const ArrayPrompt: typeof Enquirer.ArrayPrompt;
    export type ArrayPrompt<T extends Answer> = Enquirer.ArrayPrompt<T>;
  }

  //#endregion

  //#region Build-in prompts

  export class AutoComplete<T extends Answer = string> extends Select {
    constructor(question: AutoComplete.Question<T>)
    complete(): Promise<void>;
    delete(): Promise<void>;
    deleteForward(): Promise<void>;
    // TODO: fix this
    // pointer(): string;
    space(ch?: string | undefined): Promise<void>;
    suggest(input?: string, choices?: Choice[]): Choice[];
  }
  export namespace AutoComplete {
    export type Question<
      T extends Answer,
      P extends AutoComplete = AutoComplete
      > = ArrayPrompt.Question<T, P> & {
        suggest?: (this: AutoComplete, input: string, choices: Choice[]) => Choice[] | Promise<Choice[]>;
      }
  }
  export const autocomplete: AutoComplete

  export class BasicAuth extends AuthPrompt { }
  export const basicauth: BasicAuth

  export class Confirm extends BooleanPrompt { }
  export const confirm: Confirm

  export class Editable extends Select { }
  export const editable: Editable

  export class Form extends Select { }
  export const form: Form

  export class Input extends StringPrompt {
    altDown(): Promise<void>;

    altUp(): Promise<void>;

    completion(action: Action): Promise<void>;

    prev(): void;

    save(): void;

    submit(): Promise<void>;
  }
  export const input: Input

  export class Invisible extends StringPrompt {
    format(): string;
  }
  export const invisible: Invisible

  export class List extends Prompt<string[]> {
    constructor(question: List.Question)
    format(): string;
    split(input?: string): string[];
    submit(): Promise<void>;
  }
  export namespace List {
    export type Question = Omit<Prompt.Question<string[]>, 'initial'> & {
      initial?: string,
      separator?: string | RegExp
    }
  }
  export const list: List

  export class MultiSelect extends Select {
    constructor(question: MultiSelect.Question)
  }
  export namespace MultiSelect {
    export type Question = ArrayPrompt.Question<any, MultiSelect> & { maxSelected?: number };
  }
  export const multiselect: MultiSelect

  export const Numeral: typeof types.NumberPrompt
  export type Numeral = types.NumberPrompt
  export const numeral: Numeral

  export class Password extends StringPrompt { }
  export const password: Password

  export class Quiz extends Select { }
  export const quiz: Quiz

  export class Scale extends ArrayPrompt { }
  export const scale: Scale

  export class Select extends ArrayPrompt {
    dispatch(ch?: string, key?: Key): Promise<void>;

    choiceMessage(choice: Choice, i: number): string;
    choiceSeparator(): string;
    renderChoice(choice: Choice, i: number): Promise<string>;
    renderChoices(): Promise<string>
  }
  export const select: Select

  export class Snippet extends Prompt { }
  export const snippet: Snippet

  export class Sort extends Prompt { }
  export const sort: Sort

  export class Survey extends ArrayPrompt { }
  export const survey: Survey

  export const Text: typeof Input
  export type Text = Input
  export const text: Text

  export class Toggle extends BooleanPrompt { }
  export const toggle: Toggle

  export namespace prompts {
    export type AutoComplete = Enquirer.AutoComplete
    export const AutoComplete: typeof Enquirer.AutoComplete

    export type BasicAuth = Enquirer.BasicAuth
    export const BasicAuth: typeof Enquirer.BasicAuth

    export type Confirm = Enquirer.Confirm
    export const Confirm: typeof Enquirer.Confirm

    export type Editable = Enquirer.Editable
    export const Editable: typeof Enquirer.Editable

    export type Form = Enquirer.Form
    export const Form: typeof Enquirer.Form

    export type Input = Enquirer.Input
    export const Input: typeof Enquirer.Input

    export type Invisible = Enquirer.Invisible
    export const Invisible: typeof Enquirer.Invisible

    export type List = Enquirer.List
    export const List: typeof Enquirer.List

    export type MultiSelect = Enquirer.MultiSelect
    export const MultiSelect: typeof Enquirer.MultiSelect

    export type Numeral = Enquirer.Numeral
    export const Numeral: typeof Enquirer.Numeral

    export type Password = Enquirer.Password
    export const Password: typeof Enquirer.Password

    export type Quiz = Enquirer.Quiz
    export const Quiz: typeof Enquirer.Quiz

    export type Scale = Enquirer.Scale
    export const Scale: typeof Enquirer.Scale

    export type Select = Enquirer.Select
    export const Select: typeof Enquirer.Select

    export type Snippet = Enquirer.Snippet
    export const Snippet: typeof Enquirer.Snippet

    export type Sort = Enquirer.Sort
    export const Sort: typeof Enquirer.Sort

    export type Survey = Enquirer.Survey
    export const Survey: typeof Enquirer.Survey

    export type Text = Enquirer.Text
    export const Text: typeof Enquirer.Text

    export type Toggle = Enquirer.Toggle
    export const Toggle: typeof Enquirer.Toggle
  }
  //#endregion


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
