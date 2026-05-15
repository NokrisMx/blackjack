import { inject, Injectable, signal } from '@angular/core';
import { Card } from '../models/card.model';
import { DeckService } from './deck.service';
import { AudioService } from './audio.service';

@Injectable({
  providedIn: 'root',
})
export class BlackjackService {
  constructor(private deckService: DeckService) {}
  audioService = inject(AudioService);

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

    this.playerScore.update((score) => score + card.value);

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
        this.dealerScore.update((score) => score + card.value);

        setTimeout(dealNextCard, 800);
      } else {
        this.gameResolved.set(true);
        this.finishGame();
      }
    };

    dealNextCard();
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
    } else if (winner === 'Computadora gana') {
      this.audioService.playLose();
    } else {
      this.audioService.playDraw();
    }
  }
}
