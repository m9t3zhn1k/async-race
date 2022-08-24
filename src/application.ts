import { Header } from './components/header/header';
import './styles/global.scss';
import { Main } from './components/main/main';

export class Application {
  private header: Header;

  private main: Main;

  constructor() {
    this.header = new Header(document.body);
    this.main = new Main(document.body);
  }
}
