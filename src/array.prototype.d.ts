/* eslint-disable @typescript-eslint/method-signature-style */

interface Array<T> {
    includes<S>(searchElement: T extends S ? S : never, fromIndex?: number): boolean;
    indexOf<S>(searchElement: T extends S ? S : never, fromIndex?: number): number;
}
