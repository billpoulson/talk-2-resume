import { emptyString } from '@talk2resume/common';

const cm = [emptyString, '__', '--']
export function bem(...params: Array<string | undefined>) {
  return params.map((part, index) => part ? `${cm[index]}${part}` : emptyString).join(emptyString);
}
export function forComponent(block: string) {
  return (...params: string[]) => bem(block, ...params)
}
export function createComponentBem(selector: string) {
  return (element: string, modifier?: string): { [key: string]: boolean } => {
    return {
      [bem(selector, element, modifier)]: true
    }
  }
}
