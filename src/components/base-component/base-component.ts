import { IBaseComponent } from '../../types/types';

export class BaseComponent implements IBaseComponent {
  public element: HTMLElement;

  constructor(
    parent: HTMLElement,
    tag: keyof HTMLElementTagNameMap = 'div',
    className: string = '',
    attributes: { [key: string]: string } = {}
  ) {
    this.element = document.createElement(tag);
    parent.append(this.element);
    if (className) {
      this.element.className = className;
    }
    if (Object.entries(attributes).length) {
      Object.entries(attributes).forEach(([attr, value]: string[]): void => this.element.setAttribute(attr, value));
    }
  }

  public remove(): void {
    this.element.remove();
  }
}
