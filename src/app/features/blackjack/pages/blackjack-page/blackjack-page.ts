import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { BlackjackService } from '../../../../../core/services/blackjack.service';
import { AudioService } from '../../../../../core/services/audio.service';
import { CardComponent } from '../../components/card/card';
import { GameControlsComponent } from '../../components/game-controls/game-controls';
import { HistoryService } from '../../../../../core/services/history.service';

@Component({
  selector: 'app-blackjack-page',
  imports: [CommonModule, CardComponent, GameControlsComponent],
  templateUrl: './blackjack-page.html',
})
export class BlackjackPageComponent {
  blackjackService = inject(BlackjackService);
  audioService = inject(AudioService);
  historyService = inject(HistoryService);

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
      confirmButtonText: '<i class="pi pi-refresh text-md"></i> Jugar de nuevo',
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

  showRules(): void {
    Swal.fire({
      title: 'Reglas del Blackjack',
      background: '#052e16',
      color: '#6ee7b7',
      confirmButtonText: '<i class="pi pi-thumbs-up-fill text-md"></i> ¡Entendido!',
      confirmButtonColor: '#10b981',
      allowOutsideClick: true,
      customClass: {
        popup: 'swal-bj-popup',
        title: 'swal-bj-title',
        confirmButton: 'swal-bj-btn',
        htmlContainer: 'swal-bj-rules',
      },
      html: `
      <div style="text-align:left; font-size:0.95rem; line-height:1.7; color:#d1fae5;">

        <p style="margin-bottom:12px;">
          El objetivo es <strong style="color:#6ee7b7;">acercarte lo más posible a 21</strong>
          sin pasarte, y tener más puntos que la computadora.
        </p>

        <p style="margin-bottom:6px; color:#6ee7b7; font-weight:700;">Valor de las cartas</p>
        <ul style="margin-bottom:14px; padding-left:16px;">
          <li>Números <strong>2–10</strong> → su valor nominal</li>
          <li><strong>J, Q, K</strong> → valen 10</li>
          <li><strong>A (As)</strong> → vale 11</li>
        </ul>

        <p style="margin-bottom:6px; color:#6ee7b7; font-weight:700;">Cómo se juega</p>
        <ul style="margin-bottom:14px; padding-left:16px;">
          <li>Presiona <strong>Nuevo Juego</strong> para comenzar</li>
          <li>Usa <strong>Pedir Carta</strong> para recibir otra carta</li>
          <li>Usa <strong>Detener</strong> cuando no quieras más cartas</li>
          <li>La computadora jugará su turno automáticamente</li>
        </ul>

        <p style="margin-bottom:6px; color:#6ee7b7; font-weight:700;">¿Quién gana?</p>
        <ul style="padding-left:16px;">
          <li>Si te pasas de <strong>21</strong> → gana la computadora</li>
          <li>Si la computadora se pasa → <strong>ganas tú</strong></li>
          <li>El que tenga el puntaje <strong>más alto</strong> sin pasarse gana</li>
          <li>Si empatan en puntos → <strong>empate</strong></li>
        </ul>

      </div>
    `,
    });
  }

  resetHistory(): void {
    Swal.fire({
      title: '¿Borrar historial?',
      text: 'Se perderán todas las estadísticas guardadas.',
      icon: 'warning',
      background: '#052e16',
      color: '#6ee7b7',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      customClass: { popup: 'swal-bj-popup' },
    }).then((result) => {
      if (result.isConfirmed) this.historyService.reset();
    });
  }
}
