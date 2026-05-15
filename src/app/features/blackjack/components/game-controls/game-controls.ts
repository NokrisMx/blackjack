import { Component, EventEmitter, input, Input, output, Output } from '@angular/core';

@Component({
  selector: 'app-game-controls',
  templateUrl: './game-controls.html',
})
export class GameControlsComponent {
  disabled = input<boolean>(false);

  hit = output<void>();
  stand = output<void>();
  newGame = output<void>();
}
