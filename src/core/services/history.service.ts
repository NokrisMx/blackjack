import { Injectable, signal } from '@angular/core';

export interface GameHistory {
  wins: number;
  losses: number;
  ties: number;
}

const STORAGE_KEY = 'blackjack-history';

const DEFAULT: GameHistory = { wins: 0, losses: 0, ties: 0 };

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private _history = signal<GameHistory>(this.load());

  history = this._history.asReadonly();

  private load(): GameHistory {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { ...DEFAULT };
    } catch {
      return { ...DEFAULT };
    }
  }

  private save(data: GameHistory): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    this._history.set(data);
  }

  addWin(): void {
    this.save({ ...this._history(), wins: this._history().wins + 1 });
  }

  addLoss(): void {
    this.save({ ...this._history(), losses: this._history().losses + 1 });
  }

  addTie(): void {
    this.save({ ...this._history(), ties: this._history().ties + 1 });
  }

  reset(): void {
    this.save({ ...DEFAULT });
  }

  get total(): number {
    const { wins, losses, ties } = this._history();
    return wins + losses + ties;
  }
}
