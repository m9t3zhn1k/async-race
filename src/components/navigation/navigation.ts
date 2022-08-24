import { IBaseComponent } from '../../types/types';
import { BaseComponent } from '../base-component/base-component';
import './navigation.scss';

export class Navigation extends BaseComponent implements IBaseComponent {
  constructor(parent: HTMLElement) {
    super(parent, 'nav', 'navigation');
    const linkToGarage: IBaseComponent = new BaseComponent(this.element, 'a', 'navigation__link button', {
      href: '#/garage'
    });
    const linkToWinners: IBaseComponent = new BaseComponent(this.element, 'a', 'navigation__link button', {
      href: '#/winners'
    });
    linkToGarage.element.textContent = 'Garage';
    linkToWinners.element.textContent = 'Winners';
  }
}
