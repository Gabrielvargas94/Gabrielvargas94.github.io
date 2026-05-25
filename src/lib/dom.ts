// DOM selector helpers. Discouraged: direct `document.querySelector` in scripts.
// These wrap native APIs with proper TypeScript narrowing and optional scope.
//
// Usage:
//   import { $, $$ } from '@/lib/dom';
//   const btn = $<HTMLButtonElement>('.burger');
//   const items = $$<HTMLAnchorElement>('.nav .item');

type Scope = Document | Element;

export function $<E extends Element = HTMLElement>(
  selector: string,
  scope: Scope = document,
): E | null {
  return scope.querySelector<E>(selector);
}

export function $$<E extends Element = HTMLElement>(
  selector: string,
  scope: Scope = document,
): NodeListOf<E> {
  return scope.querySelectorAll<E>(selector);
}
