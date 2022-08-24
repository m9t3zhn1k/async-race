import { BaseComponent } from '../../components/base-component/base-component';
import { Car } from '../../components/car/car';
import { Pagination } from '../../components/pagination/pagination';
import { constants } from '../../constants/constansts';
import { Controller } from '../../controller/controller';
import { DisabledElements, ICar, ICarData, IWinner } from '../../types/types';
import './garage.scss';

export class Garage extends BaseComponent {
  private service: Controller = new Controller();

  private carsOnPage: ICar[] = [];

  private selectedCar: ICar | null = null;

  private carsControlsContainer: HTMLElement = new BaseComponent(this.element, 'div', 'buttons').element;

  private carsCounter: HTMLElement = new BaseComponent(this.element, 'span', 'garage__counter').element;

  private pageIndicator: HTMLElement = new BaseComponent(this.element, 'span', 'garage__page').element;

  private container: HTMLElement = new BaseComponent(this.element, 'div', 'garage__container').element;

  private createCarNameInput: HTMLInputElement = new BaseComponent(
    this.carsControlsContainer,
    'input',
    'buttons__text-input',
    {
      type: 'text'
    }
  ).element as HTMLInputElement;

  private createCarColorInput: HTMLInputElement = new BaseComponent(this.carsControlsContainer, 'input', '', {
    type: 'color'
  }).element as HTMLInputElement;

  private createNewCarButton: HTMLButtonElement = new BaseComponent(
    this.carsControlsContainer,
    'button',
    'buttons__button button'
  ).element as HTMLButtonElement;

  private updateCarNameInput: HTMLInputElement = new BaseComponent(
    this.carsControlsContainer,
    'input',
    'buttons__text-input',
    {
      type: 'text',
      disabled: ''
    }
  ).element as HTMLInputElement;

  private updateCarColorInput: HTMLInputElement = new BaseComponent(this.carsControlsContainer, 'input', '', {
    type: 'color',
    disabled: ''
  }).element as HTMLInputElement;

  private updateCarButton: HTMLButtonElement = new BaseComponent(
    this.carsControlsContainer,
    'button',
    'buttons__button button',
    {
      disabled: ''
    }
  ).element as HTMLButtonElement;

  private startRaceButton: HTMLButtonElement = new BaseComponent(
    this.carsControlsContainer,
    'button',
    'buttons__button button'
  ).element as HTMLButtonElement;

  private resetButton: HTMLButtonElement = new BaseComponent(
    this.carsControlsContainer,
    'button',
    'buttons__button button'
  ).element as HTMLButtonElement;

  private generateCarsButton: HTMLButtonElement = new BaseComponent(
    this.carsControlsContainer,
    'button',
    'buttons__button buttons__button_main button'
  ).element as HTMLButtonElement;

  private raceResultContainer: HTMLElement = new BaseComponent(this.element, 'div', 'garage__result').element;

  private pagination: Pagination = new Pagination(this.element, 'div', 'pagination');

  private currentPage: number = Number(localStorage.getItem('garagePageNumber') ?? constants.DEFAULT_PAGE_NUMBER);

  private carsQuantity: number = constants.DEFAULT_ITEMS_QUANTITY;

  constructor(parent: HTMLElement) {
    super(parent, 'section', 'garage');
    this.setElementsContent();
    this.updatePage(this.currentPage);
    this.restoreState();
    this.addEventListeners();
  }

  private setElementsContent(): void {
    this.createNewCarButton.textContent = 'Create car';
    this.updateCarButton.textContent = 'Update car';
    this.startRaceButton.textContent = 'Race';
    this.resetButton.textContent = 'Reset';
    this.generateCarsButton.textContent = 'Generate';
  }

  private restoreState(): void {
    this.createCarNameInput.value = localStorage.getItem('createCarNameInputValue') || '';
    this.updateCarNameInput.value = localStorage.getItem('updateCarNameInputValue') || '';
    this.createCarColorInput.value = localStorage.getItem('createCarColorInputValue') || constants.WHITE_COLOR;
    this.updateCarColorInput.value = localStorage.getItem('updateCarColorInputValue') || constants.WHITE_COLOR;
  }

  private addEventListeners(): void {
    this.createNewCarButton.addEventListener(
      'click',
      (): Promise<void> => this.createNewCar(this.createCarNameInput.value, this.createCarColorInput.value)
    );
    this.generateCarsButton.addEventListener('click', this.generateHundredCars.bind(this));
    this.startRaceButton.addEventListener('click', this.startRacing.bind(this));
    this.resetButton.addEventListener('click', this.resetRace.bind(this));
    this.updateCarButton.addEventListener('click', this.updateCar.bind(this));
    this.pagination.previousPageButton.addEventListener(
      'click',
      (): Promise<void> => this.updatePage(this.currentPage - 1)
    );
    this.pagination.nextPageButton.addEventListener(
      'click',
      (): Promise<void> => this.updatePage(this.currentPage + 1)
    );
    this.createCarNameInput.addEventListener('input', (): void =>
      localStorage.setItem('createCarNameInputValue', this.createCarNameInput.value)
    );
    this.updateCarNameInput.addEventListener('input', (): void =>
      localStorage.setItem('updateCarNameInputValue', this.updateCarNameInput.value)
    );
    this.createCarColorInput.addEventListener('input', (): void =>
      localStorage.setItem('createCarColorInputValue', this.createCarColorInput.value)
    );
    this.updateCarColorInput.addEventListener('input', (): void =>
      localStorage.setItem('updateCarColorInputValue', this.updateCarColorInput.value)
    );
  }

  private async updatePage(page: number): Promise<void> {
    await this.renderCars(page);
    this.pagination.toggleButtonDisabled(this.currentPage, constants.LIMIT_CARS_PER_PAGE, this.carsQuantity);
  }

  private async renderCars(
    page: number = this.currentPage,
    limit: number = constants.LIMIT_CARS_PER_PAGE
  ): Promise<void> {
    const response: Response = await this.service.getCars(page, limit);
    const quantity: number = Number(response.headers.get('X-Total-Count') ?? 0);
    const cars: ICarData[] = await response.json();
    this.container.innerHTML = '';
    this.carsOnPage = [];
    this.setCarsCounter(quantity);
    this.setPageNumber(page);
    cars.forEach(async (car: ICarData): Promise<void> => {
      if (this.carsOnPage.length < constants.LIMIT_CARS_PER_PAGE) {
        const newCar: ICar = new Car(car, this.container);
        this.addEventListenersToCarButtons(newCar);
        this.carsOnPage.push(newCar);
      }
    });
  }

  private addEventListenersToCarButtons(car: ICar): void {
    car.selectCarButton.addEventListener('click', (): void => {
      document.querySelectorAll('.button__select').forEach((button: Element): void => {
        if (button === car.selectCarButton) {
        } else {
          button.classList.remove(constants.CHECKED_ITEM_CLASS);
        }
      });
      car.selectCarButton.classList.toggle(constants.CHECKED_ITEM_CLASS);
      if (car.selectCarButton.classList.contains(constants.CHECKED_ITEM_CLASS)) {
        this.selectedCar = car;
        [this.updateCarButton, this.updateCarColorInput, this.updateCarNameInput].forEach(
          (element: DisabledElements): void => this.toggleInputDisabled(element, false)
        );
      } else {
        this.selectedCar = null;
        [this.updateCarButton, this.updateCarColorInput, this.updateCarNameInput].forEach(
          (element: DisabledElements): void => this.toggleInputDisabled(element, true)
        );
      }
    });
    car.removeCarButton.addEventListener('click', async (): Promise<void> => {
      await this.service.deleteCar(car.id);
      await this.service.deleteWinner(car.id);
      this.updatePage(this.currentPage);
    });
  }

  private toggleInputDisabled(element: DisabledElements, disabled: boolean): void {
    element.disabled = disabled;
  }

  private setCarsCounter(quantity: number): void {
    this.carsCounter.textContent = `Garage (${quantity})`;
    this.carsQuantity = quantity;
  }

  private setPageNumber(number: number): void {
    this.pageIndicator.textContent = `Page #${number}`;
    this.currentPage = number;
    localStorage.setItem('garagePageNumber', `${this.currentPage}`);
  }

  private async createNewCar(name: string, color: string): Promise<void> {
    const response: Response = await this.service.createCar(name, color);
    if (this.carsOnPage.length < constants.LIMIT_CARS_PER_PAGE) {
      const car: ICarData = await response.json();
      const newCar: ICar = new Car(car, this.container);
      this.addEventListenersToCarButtons(newCar);
      this.updatePage(this.currentPage);
    } else {
      const res: Response = await this.service.getCars(this.currentPage, constants.LIMIT_CARS_PER_PAGE);
      const quantity: number = Number(res.headers.get('X-Total-Count') ?? 0);
      this.setCarsCounter(quantity);
      this.pagination.toggleButtonDisabled(this.currentPage, constants.LIMIT_CARS_PER_PAGE, this.carsQuantity);
    }
  }

  private async updateCar(): Promise<void> {
    const inputNameValue: string = this.updateCarNameInput.value;
    const inputColorValue: string = this.updateCarColorInput.value;
    if (this.selectedCar) {
      const response: Response = await this.service.updateCar(inputNameValue, inputColorValue, this.selectedCar.id);
      const car: ICarData = await response.json();
      this.selectedCar.renderUpdatedCar(car.name, car.color);
      [this.updateCarButton, this.updateCarColorInput, this.updateCarNameInput].forEach(
        (element: DisabledElements): void => this.toggleInputDisabled(element, true)
      );
      this.selectedCar.selectCarButton.classList.remove(constants.CHECKED_ITEM_CLASS);
    }
  }

  private generateHundredCars(): void {
    for (let i = 0; i < constants.GENERATED_CARS_QUANTITY; i++) {
      const brandNumber: number = this.generateNumber(0, constants.CAR_BRANDS.length - 1);
      const modelNumber: number = this.generateNumber(0, constants.CAR_MODELS.length - 1);
      const name: string = `${constants.CAR_BRANDS[brandNumber]} ${constants.CAR_MODELS[modelNumber]}`;
      const color: string = this.generateColor();
      this.createNewCar(name, color);
    }
    this.updatePage(this.currentPage);
  }

  private startRacing(): void {
    const racingCars: Promise<ICar>[] = [];
    this.startRaceButton.disabled = true;
    this.carsOnPage.forEach(async (car: ICar): Promise<void> => {
      const promise: Promise<ICar> = new Promise((resolve): void => {
        car.svg.addEventListener('animationend', (): void => resolve(car));
      });
      car.switchEngine('started');
      racingCars.push(promise);
    });
    this.finishRacing(racingCars);
  }

  private finishRacing(cars: Promise<ICar>[]): void {
    Promise.race(cars).then(async (data: ICar): Promise<void> => {
      const response: Response = await this.service.getWinner(data.id);
      this.raceResultContainer.classList.add(constants.CHECKED_ITEM_CLASS);
      this.raceResultContainer.textContent = `${data.name} is a winner with a result of ${data.bestRaceTime}s`;
      setTimeout(
        (): void => this.raceResultContainer.classList.remove(constants.CHECKED_ITEM_CLASS),
        constants.DISPLAY_TIME
      );
      if (response.status === constants.SUCCESS_CODE) {
        const winner: IWinner = await response.json();
        const time: number = winner.time <= data.bestRaceTime ? winner.time : data.bestRaceTime;
        await this.service.updateWinner(data.id, winner.wins + 1, time);
      } else {
        await this.service.createWinner(data.id, 1, data.bestRaceTime);
      }
    });
  }

  private generateColorComponent(): string {
    return this.generateNumber(0, constants.MAX_COLOR_COMPONENT_VALUE).toString(constants.COLOR_NOTATION);
  }

  private generateColor(): string {
    return `#${this.generateColorComponent()}${this.generateColorComponent()}${this.generateColorComponent()}`;
  }

  private generateNumber(min: number, max: number): number {
    return Math.round(Math.random() * (max - min) + min);
  }

  private resetRace(): void {
    this.updatePage(this.currentPage);
    this.raceResultContainer.classList.remove(constants.CHECKED_ITEM_CLASS);
    this.startRaceButton.disabled = false;
  }
}
