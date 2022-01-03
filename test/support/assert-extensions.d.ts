declare module 'assert' {
  export function expect(
    expected: any,
    message?: string
  ): (actual: any) => void;
  export function nextTick(fn: any): Promise<any>;
  export function timeout(fn: any, ms?: number): Promise<any>;
  export function keypresses(prompt: any, chars: any): Promise<void>;
  export function has(actual: any, expected: any, message?: string): void;
}
