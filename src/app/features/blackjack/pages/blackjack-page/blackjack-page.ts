import { Component, computed, effect, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';

import { BlackjackService } from '../../../../../core/services/blackjack.service';
import { AudioService } from '../../../../../core/services/audio.service';

import { CardComponent } from '../../components/card/card';
import { GameControlsComponent } from '../../components/game-controls/game-controls';

@Component({
  selector: 'app-blackjack-page',
  standalone: true,
  imports: [CommonModule, CardComponent, GameControlsComponent],
  templateUrl: './blackjack-page.html',
  styleUrl: './blackjack-page.css',
})
export class BlackjackPageComponent {
  blackjackService = inject(BlackjackService);
  audioService = inject(AudioService);

  winner = signal('');

  gameFinished = computed(() => this.blackjackService.gameOver());

  constructor() {
    this.startGame();

    effect(() => {
      if (this.blackjackService.gameOver()) {
        this.winner.set(this.blackjackService.getWinner());
      }
    });
  }

  startGame() {
    this.blackjackService.initializeGame();
    this.winner.set('');
  }

  hit() {
    this.blackjackService.playerHit();

    this.audioService.playCard();
  }

  stand() {
    this.blackjackService.stand();

    this.audioService.playCard();
  }
}
