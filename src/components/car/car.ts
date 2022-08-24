import { BaseComponent } from '../base-component/base-component';
import './car.scss';
import svg from '../../assets/icons/car.svg';
import { ICar, ICarData, ICarRaceData, AnimationStep } from '../../types/types';
import { constants } from '../../constants/constansts';
import { Controller } from '../../controller/controller';

const MILLISECONDS_PER_SECOND: number = 1000;

export class Car implements ICar {
  private service: Controller = new Controller();

  public name: string;

  public color: string;

  public readonly id: number;

  private container: HTMLElement;

  private controlsContainer: HTMLElement;

  private roadContainer: HTMLElement;

  public selectCarButton: HTMLButtonElement;

  public removeCarButton: HTMLButtonElement;

  private startEngineButton: HTMLButtonElement;

  private stopEngineButton: HTMLButtonElement;

  private nameContainer: HTMLElement;

  public svg: SVGSVGElement;

  public bestRaceTime: number = 0;

  private animationId: number = 0;

  constructor({ name, color, id }: ICarData, private parent: HTMLElement) {
    this.name = name;
    this.color = color;
    this.id = id;
    this.container = new BaseComponent(this.parent, 'div', 'car__container').element;
    this.controlsContainer = new BaseComponent(this.container, 'div', 'car__controls').element;
    this.roadContainer = new BaseComponent(this.container, 'div', 'car__road-container').element;
    this.selectCarButton = new BaseComponent(this.controlsContainer, 'button', 'button button__select')
      .element as HTMLButtonElement;
    this.removeCarButton = new BaseComponent(this.controlsContainer, 'button', 'button').element as HTMLButtonElement;
    this.startEngineButton = new BaseComponent(this.controlsContainer, 'button', 'button car__engine-button')
      .element as HTMLButtonElement;
    this.stopEngineButton = new BaseComponent(this.controlsContainer, 'button', 'button car__engine-button', {
      disabled: ''
    }).element as HTMLButtonElement;
    this.nameContainer = new BaseComponent(this.controlsContainer, 'span', '').element;
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.renderCarSvg();
    this.setElementsContent();
    this.startEngineButton.addEventListener('click', (): Promise<void> => this.switchEngine('started'));
    this.stopEngineButton.addEventListener('click', (): Promise<void> => this.switchEngine('stopped'));
  }

  private setElementsContent(): void {
    this.selectCarButton.textContent = 'Select';
    this.removeCarButton.textContent = 'Remove';
    this.startEngineButton.textContent = 'A';
    this.stopEngineButton.textContent = 'B';
    this.nameContainer.textContent = this.name;
  }

  private renderCarSvg(): void {
    const useElem: SVGUseElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    this.svg.setAttributeNS(null, 'class', 'car');
    useElem.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `${svg}#car`);
    this.svg.appendChild(useElem);
    this.svg.style.fill = this.color;
    this.roadContainer.appendChild(this.svg);
  }

  public renderUpdatedCar(name: string, color: string): void {
    this.name = name;
    this.color = color;
    this.nameContainer.textContent = name;
    this.svg.style.fill = color;
  }

  public async switchEngine(status: 'started' | 'stopped'): Promise<void> {
    const response: Response = await this.service.startStopEngine(this.id, status);
    if (status === 'started') {
      const data: ICarRaceData = await response.json();
      const time: number = data.distance / data.velocity;
      this.startEngineButton.disabled = true;
      this.stopEngineButton.disabled = false;
      if (response.status === constants.SUCCESS_CODE) {
        Promise.resolve(await this.animateDriving(this.svg, time));
      }
      try {
        const res: Response = await this.service.switchEngineToDrive(this.id, 'drive');
        if (res.status === constants.BROKEN_ENGINE_CODE) {
          this.stopAnimateDriving(this.animationId);
          throw new Error();
        }
      } catch {
        console.log(`${this.name}'s engine is broken`);
      }
    } else {
      this.stopAnimateDriving(this.animationId);
      this.startEngineButton.disabled = false;
      this.stopEngineButton.disabled = true;
      this.svg.style.transform = 'translateX(0px)';
    }
  }

  private async animateDriving(element: SVGSVGElement, time: number): Promise<void> {
    const distance: number = this.roadContainer.clientWidth - element.clientWidth - constants.PADDING;
    let start: number | null = null;

    const step: AnimationStep = (timestamp: number): void => {
      if (!start) {
        start = timestamp;
      }
      const progress: number = (timestamp - start) / time;
      const passed: number = Math.round(progress * distance);
      element.style.transform = `translateX(${Math.min(passed, distance)}px)`;
      if (passed < distance) {
        this.animationId = window.requestAnimationFrame(step);
      } else {
        const finishEvent: Event = new Event('animationend');
        element.dispatchEvent(finishEvent);
      }
    };
    this.bestRaceTime = +(time / MILLISECONDS_PER_SECOND).toFixed(constants.ACCURACY);
    this.animationId = window.requestAnimationFrame(step);
  }

  private stopAnimateDriving(animId: number): void {
    window.cancelAnimationFrame(animId);
  }
}
