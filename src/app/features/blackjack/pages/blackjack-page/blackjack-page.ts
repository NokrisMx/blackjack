import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { BlackjackService } from '../../../../../core/services/blackjack.service';
import { AudioService } from '../../../../../core/services/audio.service';
import { CardComponent } from '../../components/card/card';
import { GameControlsComponent } from '../../components/game-controls/game-controls';

@Component({
  selector: 'app-blackjack-page',
  imports: [CommonModule, CardComponent, GameControlsComponent],
  templateUrl: './blackjack-page.html',
})
export class BlackjackPageComponent {
  blackjackService = inject(BlackjackService);
  audioService = inject(AudioService);

  winner = signal('');

  gameFinished = computed(() => this.blackjackService.gameOver());

  constructor() {
    //this.startGame();

    effect(() => {
      if (this.blackjackService.gameResolved()) {
        this.winner.set(this.blackjackService.getWinner());
        this.showResult(this.winner());
      }
    });
  }

  private showResult(winner: string): void {
    const configs = {
      'Jugador gana': {
        icon: 'success' as const,
        title: '¡Ganaste!',
        color: '#6ee7b7',
      },
      'Computadora gana': {
        icon: 'error' as const,
        title: '¡Perdiste!',
        color: '#fca5a5',
      },
      Empate: {
        icon: 'info' as const,
        title: '¡Empate!',
        color: '#fde68a',
      },
    };

    const { icon, title, color } = configs[winner as keyof typeof configs] ?? {
      icon: 'info' as const,
      title: winner,
      color: '#fff',
    };

    Swal.fire({
      icon,
      title,
      background: '#052e16',
      color,
      confirmButtonText: '🎲 Jugar de nuevo',
      confirmButtonColor: '#10b981',
      allowOutsideClick: false,
      customClass: {
        popup: 'swal-bj-popup',
        title: 'swal-bj-title',
        confirmButton: 'swal-bj-btn',
      },
    }).then((result) => {
      if (result.isConfirmed) this.startGame();
    });
  }

  startGame() {
    Swal.close();
    this.blackjackService.initializeGame();
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
