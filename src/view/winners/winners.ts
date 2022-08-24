import { BaseComponent } from '../../components/base-component/base-component';
import { Pagination } from '../../components/pagination/pagination';
import { constants } from '../../constants/constansts';
import { Controller } from '../../controller/controller';
import { ICarData, IWinner, SortingOrder, SortingParam } from '../../types/types';
import icon from '../../assets/icons/car.svg';
import './winners.scss';

export class Winners extends BaseComponent {
  private winnersCounter: HTMLElement = new BaseComponent(this.element, 'span', 'winners__counter').element;

  private pageIndicator: HTMLElement = new BaseComponent(this.element, 'span', 'winners__page').element;

  private service: Controller = new Controller();

  private pagination: Pagination = new Pagination(this.element, 'div', 'pagination');

  private currentPage: number = Number(localStorage.getItem('winnersPageNumber') ?? constants.DEFAULT_PAGE_NUMBER);

  private winnersQuantity: number = constants.DEFAULT_ITEMS_QUANTITY;

  private winnersTable: HTMLTableElement = document.createElement('table');

  private winnersTableBody: HTMLTableSectionElement = document.createElement('tbody');

  private sortingParameter: 'wins' | 'time' =
    (localStorage.getItem('sortingParameterValue') as 'wins' | 'time') ?? 'time';

  private sortingOrder: SortingOrder = (localStorage.getItem('sortingOrderValue') as SortingOrder) || 'ASC';

  constructor(parent: HTMLElement) {
    super(parent, 'section', 'winners');
    this.element.append(this.winnersTable);
    this.createTableHead();
    this.winnersTable.append(this.winnersTableBody);
    this.winnersTable.className = 'table';
    this.addEventListenersToButtons();
    this.updatePage(this.currentPage);
  }

  private createTableHead(): void {
    const head: HTMLTableSectionElement = document.createElement('thead');
    const idCell: HTMLTableCellElement = document.createElement('th');
    const carCell: HTMLTableCellElement = document.createElement('th');
    const nameCell: HTMLTableCellElement = document.createElement('th');
    const winsCell: HTMLTableCellElement = document.createElement('th');
    const bestTimeCell: HTMLTableCellElement = document.createElement('th');
    this.winnersTable.appendChild(head);
    head.append(idCell, carCell, nameCell, winsCell, bestTimeCell);
    idCell.textContent = 'ID';
    carCell.textContent = 'Car';
    nameCell.textContent = 'Name';
    winsCell.textContent = 'Wins';
    bestTimeCell.textContent = 'Best time';
    head.className = 'table__head';
    [idCell, carCell, nameCell, winsCell, bestTimeCell].forEach(
      (item: HTMLTableCellElement): string => (item.className = 'table__cell')
    );
    winsCell.classList.add('table__head_sort');
    bestTimeCell.classList.add('table__head_sort');
    bestTimeCell.addEventListener('click', (): void => this.toggleSorting('time'));
    winsCell.addEventListener('click', (): void => this.toggleSorting('wins'));
  }

  private toggleSorting(param: 'wins' | 'time'): void {
    if (this.sortingParameter === param) {
      this.sortingOrder = this.sortingOrder === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.sortingParameter = param;
    }
    localStorage.setItem('sortingParameterValue', this.sortingParameter);
    localStorage.setItem('sortingOrderValue', this.sortingOrder);
    this.updatePage(this.currentPage);
  }

  private async createTableRow(winner: IWinner): Promise<void> {
    const row: HTMLTableRowElement = this.winnersTableBody.insertRow();
    const idCell: HTMLTableCellElement = row.insertCell();
    const carCell: HTMLTableCellElement = row.insertCell();
    const nameCell: HTMLTableCellElement = row.insertCell();
    const winsCell: HTMLTableCellElement = row.insertCell();
    const bestTimeCell: HTMLTableCellElement = row.insertCell();
    const winnerResponse: Response = await this.service.getCar(winner.id);
    const data: ICarData = await winnerResponse.json();
    const svg: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const useElem: SVGUseElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    svg.setAttributeNS(null, 'class', 'winners__car');
    useElem.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `${icon}#car`);
    svg.appendChild(useElem);
    svg.style.fill = data.color;
    idCell.textContent = `${winner.id}`;
    winsCell.textContent = `${winner.wins}`;
    bestTimeCell.textContent = `${winner.time}`;
    nameCell.textContent = `${data.name}`;
    carCell.appendChild(svg);
    [idCell, carCell, nameCell, winsCell, bestTimeCell].forEach(
      (item: HTMLTableCellElement): string => (item.className = 'table__cell')
    );
  }

  private async updatePage(page: number): Promise<void> {
    await this.getWinners(page);
    this.pagination.toggleButtonDisabled(this.currentPage, constants.LIMIT_WINNERS_PER_PAGE, this.winnersQuantity);
  }

  private async getWinners(
    page: number = this.currentPage,
    limit: number = constants.LIMIT_WINNERS_PER_PAGE,
    sort: SortingParam = this.sortingParameter,
    order: SortingOrder = this.sortingOrder
  ): Promise<void> {
    const response: Response = await this.service.getWinners(page, limit, sort, order);
    const quantity: number = Number(response.headers.get('X-Total-Count') ?? 0);
    const winners: IWinner[] = await response.json();
    this.winnersTableBody.innerHTML = '';
    this.setWinnersCounter(quantity);
    this.setPageNumber(page);
    winners.forEach((winner: IWinner): Promise<void> => this.createTableRow(winner));
  }

  private setWinnersCounter(quantity: number): void {
    this.winnersCounter.textContent = `Winners (${quantity})`;
    this.winnersQuantity = quantity;
  }

  private setPageNumber(number: number): void {
    this.pageIndicator.textContent = `Page #${number}`;
    this.currentPage = number;
    localStorage.setItem('winnersPageNumber', `${this.currentPage}`);
  }

  private addEventListenersToButtons(): void {
    this.pagination.previousPageButton.addEventListener(
      'click',
      (): Promise<void> => this.updatePage(this.currentPage - 1)
    );
    this.pagination.nextPageButton.addEventListener(
      'click',
      (): Promise<void> => this.updatePage(this.currentPage + 1)
    );
  }
}
