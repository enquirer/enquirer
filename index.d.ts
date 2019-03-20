// Type definitions for enquirer 2.1
// Project: https://github.com/enquirer/enquirer
// Definitions by: Kamontat Chantrachirathumrong <https://github.com/kamontat>
// TypeScript Version: 2.8

export = EnquirerStatic;

declare class EnquirerStatic<R = any, N extends string = string> extends NodeJS.EventEmitter {
  // TODO: update object options
  constructor(options?: object, answers?: object);

  /**
   * Register a custom prompt type.
   *
   * @param type
   * @param fn `Prompt` class, or a function that returns a `Prompt` class.
   */
  register(type: string): this;

  /**
   * Prompt function that takes a "question" object or array of question objects,
   * and returns an object with responses from the user.
   *
   * @param question Array of question for prompts to run.
   */
  prompt(questions: Array<EnquirerStatic.PromptOptions<N>>): Promise<EnquirerStatic.PromptType.Answers<N, R>>;

  /**
   * Prompt function that takes a "question" object or array of question objects,
   * and returns an object with responses from the user.
   *
   * @param question Question for prompts to run.
   */
  prompt(question: EnquirerStatic.PromptOptions<N>): Promise<R>;

  /**
   * Use an enquirer plugin.
   *
   * @param plugin Plugin function that takes an instance of Enquirer.
   */
  use(plugin: EnquirerStatic.TypeUtils.BindOneParam<this, this, void>): this;
}

declare namespace EnquirerStatic {
  namespace TypeUtils {
    type NoParam<R> = () => R;
    type OneParam<T, R = T> = (value: T) => R;

    type BindNoParam<B, R> = (this: B) => R;
    type BindOneParam<B, T, R> = (this: B, value: T) => R;

    type ValueOrFunc<T, R = T> = R | OneParam<T, R>;

    type ValueOrArray<T> = T | T[];

    type ValueOrPromise<T> = T | Promise<T>;
  }

  namespace PromptType {
    type Answers<T extends string, R = any> = { [id in T]: R };

    interface BaseOptions<N extends string> {
      name: TypeUtils.ValueOrFunc<N>;
      message: TypeUtils.ValueOrFunc<N, TypeUtils.ValueOrPromise<string>>; // async

      // TODO: What type of Skip parameters method.
      skip?: TypeUtils.ValueOrFunc<Answers<N> | string, TypeUtils.ValueOrPromise<boolean>>; // async

      format?: TypeUtils.OneParam<string, TypeUtils.ValueOrPromise<string>>; // async
      result?: TypeUtils.OneParam<string, TypeUtils.ValueOrPromise<string>>; // async
      validate?: TypeUtils.OneParam<string, TypeUtils.ValueOrPromise<string | boolean>>; // async

      stdin?: NodeJS.ReadStream;
      stdout?: NodeJS.WriteStream;
    }

    interface BaseTypeOptions<T extends string> {
      type: TypeUtils.ValueOrFunc<T>;
    }

    interface Choice {
      name: string;
      message?: string;
      value?: string;
      hint?: string;
      disabled?: boolean | string;
    }

    type StringType = "input" | "invisible" | "list" | "password" | "text";

    type NumberType = "numeral";

    type SortType = "sort";

    type SnippetType = "snippet";

    type BooleanType = "confirm";

    type ArrayType = "autocomplete" | "editable" | "form" | "multiselect" | "select" | "survey" | "list" | "scale"; // TODO: This support Falsy value ???

    interface ArrayOptions<N extends string = string> extends BaseOptions<N> {
      choices: string[] | Choice[];
      maxChoices?: number;
      muliple?: boolean;
      initial?: number;
      delay?: number;
      separator?: boolean;
      sort?: boolean;
      linebreak?: boolean;
      edgeLength?: number;
      align?: "left" | "right";
      scroll?: boolean;
    }

    interface StringOptions<N extends string = string> extends BaseOptions<N> {
      initial?: string;
      multiline?: boolean;
    }

    interface NumberOptions<N extends string = string> extends BaseOptions<N> {
      min?: number;
      max?: number;
      delay?: number;
      float?: boolean;
      round?: boolean;
      major?: number;
      minor?: number;
      initial?: number;
    }

    interface SnippetOptions<N extends string = string> extends BaseOptions<N> {
      newline?: string;
    }

    interface SortOptions<N extends string = string> extends BaseOptions<N> {
      hint?: string;
      drag?: boolean;
      numbered?: boolean;
    }

    interface BooleanOptions<N extends string = string> extends BaseOptions<N> {
      initial?: boolean;
    }

    interface SnippetTypeOptions<N extends string> extends BaseTypeOptions<SnippetType>, SnippetOptions<N> {}

    interface SortTypeOptions<N extends string> extends BaseTypeOptions<SortType>, SortOptions<N> {}

    interface StringTypeOptions<N extends string> extends BaseTypeOptions<StringType>, StringOptions<N> {}

    interface ArrayTypeOptions<N extends string> extends BaseTypeOptions<ArrayType>, ArrayOptions<N> {}

    interface BooleanTypeOptions<N extends string> extends BaseTypeOptions<BooleanType>, BooleanOptions<N> {}

    interface NumberTypeOptions<N extends string> extends BaseTypeOptions<NumberType>, NumberOptions<N> {}
  }

  type PromptOptions<N extends string> =
    | PromptType.BaseOptions<N>
    | PromptType.BaseTypeOptions<N>
    | PromptType.StringTypeOptions<N>
    | PromptType.NumberTypeOptions<N>
    | PromptType.ArrayTypeOptions<N>
    | PromptType.BooleanTypeOptions<N>
    | PromptType.SortTypeOptions<N>
    | PromptType.SnippetTypeOptions<N>; //

  // ################################# //
  // Prompts utils method              //
  // ################################# //

  export function prompt<R = any, N extends string = string>(
    questions: Array<PromptOptions<N>>
  ): Promise<PromptType.Answers<N, R>>;

  export function prompt<R = string, N extends string = string>(questions: PromptOptions<N>): Promise<R>;

  // ################################# //
  // Individual Prompts class          //
  // ################################# //

  class BasePrompt<R, O extends PromptType.BaseOptions<string> = PromptType.BaseOptions<string>> extends Prompt<R> {
    constructor(option?: O);
  }

  class Input extends BasePrompt<string, PromptType.StringOptions> {}
  class Text extends Input {}
  class Invisible extends Input {}
  class Password extends Input {}

  class Numeral extends BasePrompt<number, PromptType.NumberOptions> {}

  class Select<R = string> extends BasePrompt<R, PromptType.ArrayOptions> {}
  // TODO: Make need to update, Not public YET!
  class Editable<R = string> extends Select<R> {}
  // TODO: Make need to update, Not public YET!
  class Scale<R = string> extends Select<R> {}

  // TODO: Might have something better than `object`
  class Survey<R = object> extends Select<R> {}

  class Snippet<R = any> extends BasePrompt<R, PromptType.SnippetOptions> {}
  class Sort<R = string> extends BasePrompt<R[], PromptType.SortOptions> {}

  class MultiSelect<R = string[]> extends Select<R> {}
  class AutoComplete<R = any> extends Select<R> {}

  class List<R = any> extends BasePrompt<R[], PromptType.ArrayOptions> {}

  // TODO: Might have something better than `object`
  class Form extends BasePrompt<object, PromptType.ArrayOptions> {}

  class Prompt<R> extends NodeJS.EventEmitter {
    readonly base: Prompt<R>;

    // TODO: Recheck this return type
    readonly style: string;

    readonly height: number;

    readonly width: number;

    cursor: any; // set / get

    input: any;

    value: any;

    // TODO: Is this contructor able to get answer?
    constructor(option?: object, answer?: object);

    keypress(this: this, char: any, event: object): void | Promise<any>; //async
    alert(this: this): void;

    cursorHide(this: this): void;
    cursorShow(this: this): void;

    write(this: this, str: string): void;
    clear(this: this, lines: number): void;

    restore(this: this): void;
    // TODO: Improve this method return
    sections(
      this: this
    ): {
      header: any;
      prompt: any;
      after: any;
      rest: any;
      last: any;
    };

    submit(this: this): void | Promise<any>;

    // TODO: what is type of error of this method
    cancel(this: this, err: Error | string): void | Promise<any>;

    close(this: this): void | Promise<any>;

    start(this: this): void;

    initialize(this: this): void | Promise<any>;

    render(this: this): void;

    run(this: this): Promise<R>;

    // TODO: Recheck is method
    element(this: this, name: string, choice?: object, i?: number): Promise<any>;

    prefix(this: this): Promise<any>;

    message(this: this): Promise<string>;

    separator(this: this): Promise<string>;

    // TODO: Recheck is method
    pointer(this: this, choice?: object, i?: number): Promise<string>;

    indicator(this: this, choice?: object, i?: number): Promise<string>;

    body(this: this): string | undefined | null;

    // TODO: Recheck is method
    footer(this: this): Promise<string>;

    // TODO: Recheck is method
    header(this: this): Promise<string>;

    hint(this: this): Promise<string>;

    error(this: this, err?: string | Error): boolean;

    format(this: this, value: any): string;

    result(this: this, value: any): any;

    validate(this: this, value: any): boolean;

    isValue(this: this, value: any): boolean;

    resolve(this: this, value: any, ...args: any[]): Promise<any>;
  }
}
