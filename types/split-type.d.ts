declare module 'split-type' {
  export interface SplitTypeOptions {
    types?: string;
    tagName?: string;
    lineClass?: string;
    wordClass?: string;
    charClass?: string;
    splitClass?: string;
    absolute?: boolean;
  }

  export default class SplitType {
    constructor(target: string | Element | NodeList | Array<Element>, options?: SplitTypeOptions);
    lines: HTMLElement[] | null;
    words: HTMLElement[] | null;
    chars: HTMLElement[] | null;
    revert(): void;
    split(options?: SplitTypeOptions): void;
  }
}
