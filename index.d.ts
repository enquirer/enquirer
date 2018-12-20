/// <reference types="node"/>

import { EventEmitter } from 'events';
import { ReadStream, WriteStream } from 'fs';

export = Enquirer;

declare class BasePrompt extends EventEmitter {
  constructor(options?: Enquirer.PromptOptions);
  render(): void;
  run(): Promise<any>;
}

declare class Prompt extends BasePrompt {}
declare class ArrayPrompt extends BasePrompt {}
declare class BooleanPrompt extends BasePrompt {}
declare class NumberPrompt extends BasePrompt {}
declare class StringPromp extends BasePrompt {}

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
    fn: typeof BasePrompt | (() => typeof BasePrompt)
  ): this;

  /**
   * Register a custom prompt type.
   */
  register(type: {
    [key: string]: typeof BasePrompt | (() => typeof BasePrompt);
  }): this;

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
      | (
          | Enquirer.PromptOptions
          | ((this: Enquirer) => Enquirer.PromptOptions))[]
  ): Promise<T>;

  /**
   * Use an enquirer plugin.
   *
   * @param plugin Plugin function that takes an instance of Enquirer.
   */
  use(plugin: (this: this, enquirer: this) => void): this;
}

declare namespace Enquirer {
  function prompt<T = object>(
    questions:
      | PromptOptions
      | ((this: Enquirer) => PromptOptions)
      | (PromptOptions | ((this: Enquirer) => PromptOptions))[]
  ): Promise<T>;

  const autocomplete: BasePrompt['run'];
  const confirm: BasePrompt['run'];
  const editable: BasePrompt['run'];
  const form: BasePrompt['run'];
  const input: BasePrompt['run'];
  const invisible: BasePrompt['run'];
  const list: BasePrompt['run'];
  const multiselect: BasePrompt['run'];
  const numeral: BasePrompt['run'];
  const password: BasePrompt['run'];
  const scale: BasePrompt['run'];
  const select: BasePrompt['run'];
  const snippet: BasePrompt['run'];
  const sort: BasePrompt['run'];
  const survey: BasePrompt['run'];
  const text: BasePrompt['run'];
  const toggle: BasePrompt['run'];

  interface BasePromptOptions {
    name: string | (() => string);
    type: string | (() => string);
    message: string | (() => string) | (() => Promise<string>);
    initial?: any;
    required?: boolean;
    format?(value: string): string | Promise<string>;
    result?(value: string): string | Promise<string>;
    skip?: ((state: object) => boolean | Promise<boolean>) | boolean;
    validate?(
      value: string
    ): boolean | Promise<boolean> | string | Promise<string>;
    onSubmit?(
      name: string,
      value: any,
      prompt: Prompt
    ): boolean | Promise<boolean>;
    onCancel?(
      name: string,
      value: any,
      prompt: Prompt
    ): boolean | Promise<boolean>;
    stdin?: ReadStream;
    stdout?: WriteStream;
  }

  interface Choice {
    name: string;
    message?: string;
    value?: string;
    hint?: string;
    disabled?: boolean | string;
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
      | 'toggle';
    choices: string[] | Choice[];
    maxChoices?: number;
    muliple?: boolean;
    initial?: number;
    delay?: number;
    separator?: boolean;
    sort?: boolean;
    linebreak?: boolean;
    edgeLength?: number;
    align?: 'left' | 'right';
    scroll?: boolean;
  }

  interface BooleanPromptOptions extends BasePromptOptions {
    type: 'confirm';
    initial?: boolean;
  }

  interface TogglePromptOptions extends BasePromptOptions {
    enabled?: string;
    disabled?: string;
    initial?: boolean;
  }

  interface StringPromptOptions extends BasePromptOptions {
    type: 'input' | 'invisible' | 'list' | 'password' | 'text';
    initial?: string;
    multiline?: boolean;
  }

  interface NumberPromptOptions extends BasePromptOptions {
    type: 'numeral';
    min?: number;
    max?: number;
    delay?: number;
    float?: boolean;
    round?: boolean;
    major?: number;
    minor?: number;
    initial?: number;
  }

  interface SnippetPromptOptions extends BasePromptOptions {
    type: 'snippet';
    newline?: string;
  }

  interface SortPromptOptions extends BasePromptOptions {
    type: 'sort';
    hint?: string;
    drag?: boolean;
    numbered?: boolean;
  }

  type PromptOptions =
    | ArrayPromptOptions
    | BooleanPromptOptions
    | TogglePromptOptions
    | StringPromptOptions
    | NumberPromptOptions
    | SnippetPromptOptions
    | SortPromptOptions
    | BasePromptOptions;
}
