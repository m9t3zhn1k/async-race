import { IController, SortingOrder, SortingParam } from '../types/types';

export class Controller implements IController {
  private serverURL: string = 'http://127.0.0.1:3000';

  public async getCars(page: number, limit: number): Promise<Response> {
    return fetch(`${this.serverURL}/garage?_page=${page}&_limit=${limit}`);
  }

  public async getCar(id: number): Promise<Response> {
    return fetch(`${this.serverURL}/garage/${id}`);
  }

  public async createCar(name: string, color: string): Promise<Response> {
    return fetch(`${this.serverURL}/garage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, color })
    });
  }

  public async updateCar(name: string, color: string, id: number): Promise<Response> {
    return fetch(`${this.serverURL}/garage/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, color })
    });
  }

  public async deleteCar(id: number): Promise<Response> {
    return fetch(`${this.serverURL}/garage/${id}`, {
      method: 'DELETE'
    });
  }

  public async startStopEngine(id: number, status: 'started' | 'stopped'): Promise<Response> {
    return fetch(`${this.serverURL}/engine?id=${id}&status=${status}`, {
      method: 'PATCH'
    });
  }

  public async switchEngineToDrive(id: number, status: 'drive'): Promise<Response> {
    return fetch(`${this.serverURL}/engine?id=${id}&status=${status}`, {
      method: 'PATCH'
    });
  }

  public async getWinner(id: number): Promise<Response> {
    return fetch(`${this.serverURL}/winners/${id}`);
  }

  public async getWinners(page: number, limit: number, sort: SortingParam, order: SortingOrder): Promise<Response> {
    return fetch(`${this.serverURL}/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`);
  }

  public async createWinner(id: number, wins: number, time: number): Promise<Response> {
    return fetch(`${this.serverURL}/winners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, wins, time })
    });
  }

  public async deleteWinner(id: number): Promise<Response> {
    return fetch(`${this.serverURL}/winners/${id}`, {
      method: 'DELETE'
    });
  }

  public async updateWinner(id: number, wins: number, time: number): Promise<Response> {
    return fetch(`${this.serverURL}/winners/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ wins, time })
    });
  }
}
