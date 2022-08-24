import { Router } from '../../routes/routes';
import { IBaseComponent } from '../../types/types';
import { BaseComponent } from '../base-component/base-component';

export class Main extends BaseComponent implements IBaseComponent {
  private router: Router = new Router(this.element);

  constructor(parent: HTMLElement) {
    super(parent, 'main', 'main');
  }
}
