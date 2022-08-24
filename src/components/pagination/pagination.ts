import { constants } from '../../constants/constansts';
import { IPagination } from '../../types/types';
import { BaseComponent } from '../base-component/base-component';
import './pagination.scss';

export class Pagination extends BaseComponent implements IPagination {
  public previousPageButton: HTMLButtonElement = new BaseComponent(this.element, 'button', 'button pagination__button')
    .element as HTMLButtonElement;

  public nextPageButton: HTMLButtonElement = new BaseComponent(this.element, 'button', 'button pagination__button')
    .element as HTMLButtonElement;

  constructor(parent: HTMLElement, tag?: keyof HTMLElementTagNameMap, className?: string) {
    super(parent, tag, className);
    this.previousPageButton.textContent = 'Previous';
    this.nextPageButton.textContent = 'Next';
  }

  public toggleButtonDisabled(pageNumber: number, limit: number, quantity: number): void {
    this.previousPageButton.disabled = pageNumber <= constants.FIRST_PAGE_NUMBER;
    this.nextPageButton.disabled = pageNumber * limit >= quantity;
  }
}
