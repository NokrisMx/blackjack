import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-game-controls',
  standalone: true,
  templateUrl: './game-controls.html',
  styleUrl: './game-controls.css',
})
export class GameControlsComponent {
  @Input() disabled = false;

  @Output() hit = new EventEmitter<void>();
  @Output() stand = new EventEmitter<void>();
  @Output() newGame = new EventEmitter<void>();
}
