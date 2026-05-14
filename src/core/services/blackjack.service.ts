import { Injectable, signal } from '@angular/core';
import { Card } from '../models/card.model';
import { DeckService } from './deck.service';

@Injectable({
  providedIn: 'root',
})
export class BlackjackService {
  constructor(private deckService: DeckService) {}

  deck = signal<Card[]>([]);

  playerCards = signal<Card[]>([]);
  dealerCards = signal<Card[]>([]);

  playerScore = signal(0);
  dealerScore = signal(0);

  gameOver = signal(false);

  initializeGame() {
    this.deck.set(this.deckService.createDeck());

    this.playerCards.set([]);
    this.dealerCards.set([]);

    this.playerScore.set(0);
    this.dealerScore.set(0);

    this.gameOver.set(false);
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

    this.playerScore.update((score) => score + card.value);

    if (this.playerScore() >= 21) {
      this.stand();
    }
  }

  stand() {
    this.gameOver.set(true);

    while (this.dealerScore() < this.playerScore() && this.playerScore() <= 21) {
      const card = this.drawCard();

      this.dealerCards.update((cards) => [...cards, card]);

      this.dealerScore.update((score) => score + card.value);
    }
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
}
