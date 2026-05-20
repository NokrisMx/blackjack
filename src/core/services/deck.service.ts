import { inject, Injectable } from '@angular/core';
import { Card } from '../models/card.model';
import { AudioService } from './audio.service';
import * as _ from 'underscore';

@Injectable({
  providedIn: 'root',
})
export class DeckService {
  audioService = inject(AudioService);
  private suits = ['C', 'D', 'H', 'S'];
  private specials = ['A', 'J', 'Q', 'K'];

  createDeck(): Card[] {
    const deck: Card[] = [];

    for (let i = 2; i <= 10; i++) {
      for (const suit of this.suits) {
        deck.push({
          code: `${i}${suit}`,
          image: `assets/cards/${i}${suit}.png`,
          value: i,
        });
      }
    }

    for (const suit of this.suits) {
      for (const special of this.specials) {
        deck.push({
          code: `${special}${suit}`,
          image: `assets/cards/${special}${suit}.png`,
          value: special === 'A' ? 11 : 10,
        });
      }
    }

    this.audioService.playShuffle();
    return _.shuffle(deck);
  }
}
