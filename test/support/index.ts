import nodeAssert from 'assert'

declare module 'assert' {
  export function has(
    a: string | Array<any> | Record<string, any>,
    b: string | Array<any> | Record<string, any>,
    msg?: string): void
}


export default function support(assert: typeof nodeAssert) {
  (assert as any).has = function (
    a: string | Array<any> | Record<string, any>,
    b: string | Array<any> | Record<string, any>,
    msg?: string
  ) {
    if (Array.isArray(a)) {
      assert(Array.isArray(b), 'expected an array');
      for (let i = 0; i < b.length; i++) assert.has(a[i], (b as any)[i], msg);
      return;
    }

    if (typeof a === 'string') {
      assert.equal(typeof b, 'string', 'expected a string');
      assert(a.includes(b as string), msg);
      return;
    }

    for (const key of Object.keys(b)) {
      assert.deepEqual(a[key], (b as any)[key], msg);
    }
  };

  const utils = {
    expect: (expected: any, msg?: string) => (actual: any) => assert.deepEqual(actual, expected, msg),
    nextTick: <T>(fn: () => Promise<T>) => {
      return new Promise<T>((resolve, reject) => {
        process.nextTick(() => fn().then(resolve).catch(reject));
      });
    },
    immediate: <T = void>(fn: () => Promise<T>) => {
      return new Promise<T>((resolve, reject) => {
        setImmediate(() => fn().then(resolve).catch(reject));
      });
    },
    timeout: <T>(fn: () => Promise<T>, ms = 0) => {
      return new Promise<T>((resolve, reject) => {
        setTimeout(() => fn().then(resolve).catch(reject), ms);
      });
    },
    keypresses: async (prompt: any, chars: string[]) => {
      for (const ch of chars) {
        await utils.timeout(() => prompt.keypress(ch));
      }
    }
  }
  return utils;
}
