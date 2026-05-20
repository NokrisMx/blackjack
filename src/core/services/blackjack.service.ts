import { inject, Injectable, signal } from '@angular/core';
import { Card } from '../models/card.model';
import { DeckService } from './deck.service';
import { AudioService } from './audio.service';
import { HistoryService } from './history.service';

@Injectable({
  providedIn: 'root',
})
export class BlackjackService {
  constructor(private deckService: DeckService) {}
  audioService = inject(AudioService);
  historyService = inject(HistoryService);

  deck = signal<Card[]>([]);

  playerCards = signal<Card[]>([]);
  dealerCards = signal<Card[]>([]);

  playerScore = signal(0);
  dealerScore = signal(0);

  gameOver = signal(true);
  gameResolved = signal(false);

  initializeGame() {
    this.deck.set(this.deckService.createDeck());

    this.playerCards.set([]);
    this.dealerCards.set([]);

    this.playerScore.set(0);
    this.dealerScore.set(0);

    this.gameOver.set(false);
    this.gameResolved.set(false);
  }

  drawCard(): Card {
    const currentDeck = this.deck();

    if (!currentDeck.length) {
      throw new Error('No hay cartas');
    }

    const card = currentDeck.pop()!;

    this.deck.set([...currentDeck]);

    return card;
  }

  playerHit() {
    if (this.gameOver()) return;

    const card = this.drawCard();

    this.playerCards.update((cards) => [...cards, card]);

    this.playerScore.set(this.calculateScore(this.playerCards()));

    if (this.playerScore() >= 21) {
      this.stand();
    }
  }

  stand() {
    if (this.gameOver()) return;

    // Si el jugador ya se pasó, termina directo
    if (this.playerScore() > 21) {
      this.gameOver.set(true);
      this.gameResolved.set(true);
      this.finishGame();
      return;
    }

    this.gameOver.set(true);
    this.dealerTurn();
  }

  private dealerTurn(): void {
    const dealNextCard = () => {
      const dealerScore = this.dealerScore();
      const playerScore = this.playerScore();

      if (dealerScore < playerScore && playerScore <= 21) {
        const card = this.drawCard();

        this.audioService.playCard();
        this.dealerCards.update((cards) => [...cards, card]);
        this.dealerScore.set(this.calculateScore(this.dealerCards()));

        setTimeout(dealNextCard, 800);
      } else {
        this.gameResolved.set(true);
        this.finishGame();
      }
    };

    dealNextCard();
  }

  private calculateScore(cards: Card[]): number {
    let score = 0;
    let aces = 0;

    for (const card of cards) {
      if (card.code.startsWith('A')) {
        aces++;
        score += 11;
      } else {
        score += card.value;
      }
    }

    // Si nos pasamos y hay ases, los convertimos a 1 de uno en uno
    while (score > 21 && aces > 0) {
      score -= 10; // 11 - 1 = 10 de diferencia
      aces--;
    }

    return score;
  }

  getWinner(): string {
    const player = this.playerScore();
    const dealer = this.dealerScore();

    if (player > 21) {
      return 'Computadora gana';
    }

    if (dealer > 21) {
      return 'Jugador gana';
    }

    if (player === dealer) {
      return 'Empate';
    }

    return player > dealer ? 'Jugador gana' : 'Computadora gana';
  }

  private finishGame() {
    const winner = this.getWinner();

    if (winner === 'Jugador gana') {
      this.audioService.playWin();
      this.historyService.addWin();
    } else if (winner === 'Computadora gana') {
      this.audioService.playLose();
      this.historyService.addLoss();
    } else {
      this.audioService.playDraw();
      this.historyService.addTie();
    }
  }
}
