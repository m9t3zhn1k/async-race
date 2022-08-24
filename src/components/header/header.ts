import { IBaseComponent, IHeader } from '../../types/types';
import { BaseComponent } from '../base-component/base-component';
import { Navigation } from '../navigation/navigation';
import './header.scss';

export class Header extends BaseComponent implements IHeader {
  public readonly navigation: IBaseComponent;

  constructor(parent: HTMLElement) {
    super(parent, 'header', 'header');
    this.navigation = new Navigation(this.element);
  }
}
