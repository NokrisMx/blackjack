import { Injectable } from '@angular/core';
// @ts-ignore
import { Howl } from 'howler';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private cardSound = new Howl({
    src: ['assets/sounds/card.mp3'],
    volume: 0.5,
  });

  private winSound = new Howl({
    src: ['assets/sounds/win.mp3'],
    volume: 0.6,
  });

  private loseSound = new Howl({
    src: ['assets/sounds/lose.mp3'],
    volume: 0.6,
  });

  playCard() {
    this.cardSound.play();
  }

  playWin() {
    this.winSound.play();
  }

  playLose() {
    this.loseSound.play();
  }
}
