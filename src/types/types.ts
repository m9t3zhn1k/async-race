import { Garage } from '../view/garage/garage';
import { Winners } from '../view/winners/winners';

export interface IBaseComponent {
  element: HTMLElement;
  remove(): void;
}

export interface IController {
  getCars(page: number, limit: number): Promise<Response>;
  getCar(page: number): Promise<Response>;
  createCar(name: string, color: string): Promise<Response>;
  updateCar(name: string, color: string, id: number): Promise<Response>;
  deleteCar(id: number): Promise<Response>;
  startStopEngine(id: number, status: 'started' | 'stopped'): Promise<Response>;
  switchEngineToDrive(id: number, status: 'drive'): Promise<Response>;
  getWinner(id: number): Promise<Response>;
  getWinners(page: number, limit: number, sort: SortingParam, order: SortingOrder): Promise<Response>;
  createWinner(id: number, wins: number, time: number): Promise<Response>;
  deleteWinner(id: number): Promise<Response>;
  updateWinner(id: number, wins: number, time: number): Promise<Response>;
}

export type SortingParam = 'id' | 'wins' | 'time';

export type SortingOrder = 'ASC' | 'DESC';

export type DisabledElements = HTMLButtonElement | HTMLInputElement;

export interface IHeader extends IBaseComponent {
  navigation: IBaseComponent;
}

export interface ICar {
  name: string;
  color: string;
  id: number;
  selectCarButton: HTMLButtonElement;
  removeCarButton: HTMLButtonElement;
  svg: SVGSVGElement;
  bestRaceTime: number;
  renderUpdatedCar(name: string, color: string): void;
  switchEngine(status: 'started' | 'stopped'): Promise<void>;
}

export interface IPagination {
  previousPageButton: HTMLButtonElement;
  nextPageButton: HTMLButtonElement;
  toggleButtonDisabled(pageNumber: number, limit: number, quantity: number): void;
}

export interface ICarData {
  name: string;
  color: string;
  id: number;
}

export interface ICarRaceData {
  velocity: number;
  distance: number;
}

export interface IWinner {
  id: number;
  wins: number;
  time: number;
}

export interface IConstants {
  LIMIT_CARS_PER_PAGE: number;
  LIMIT_WINNERS_PER_PAGE: number;
  CHECKED_ITEM_CLASS: 'active';
  PADDING: number;
  DEFAULT_PAGE_NUMBER: number;
  DEFAULT_ITEMS_QUANTITY: number;
  CAR_BRANDS: string[];
  CAR_MODELS: string[];
  SUCCESS_CODE: number;
  BROKEN_ENGINE_CODE: number;
  ACCURACY: number;
  FIRST_PAGE_NUMBER: number;
  MAX_COLOR_COMPONENT_VALUE: number;
  COLOR_NOTATION: number;
  WHITE_COLOR: string;
  DISPLAY_TIME: number;
  GENERATED_CARS_QUANTITY: number;
}

export type SectionType = typeof Garage | typeof Winners;

export type AnimationStep = (timestamp: number) => void;
