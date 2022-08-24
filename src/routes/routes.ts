import { IBaseComponent, SectionType } from '../types/types';
import { Garage } from '../view/garage/garage';
import { Winners } from '../view/winners/winners';

const DEFAULT_PATH: string = 'garage';

export class Router {
  private currentSection: IBaseComponent;

  private garage: string = 'garage';

  private winners: string = 'winners';

  constructor(private parent: HTMLElement) {
    this.currentSection = new (this.getSection())(this.parent);
    window.addEventListener('popstate', this.updateSection.bind(this));
  }

  private getSection(path?: string): SectionType {
    switch (path || location.hash.split('/')?.pop() || DEFAULT_PATH) {
      case this.winners:
        return Winners;
      case this.garage:
      default:
        return Garage;
    }
  }

  private updateSection(): void {
    const path: string = location.hash.split('/')?.pop() ?? '';
    const newSection: SectionType = this.getSection(path);
    if (this.currentSection instanceof newSection) {
      return;
    }
    this.currentSection.remove();
    this.currentSection = new newSection(this.parent);
  }
}
