import { Component, ElementRef, AfterViewInit, input, viewChild } from '@angular/core';

import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  templateUrl: './card.html',
})
export class CardComponent implements AfterViewInit {
  image = input.required<string>();

  cardRef = viewChild<ElementRef>('cardRef');

  ngAfterViewInit(): void {
    gsap.from(this.cardRef()?.nativeElement, {
      y: -300,
      x: -200,
      rotate: -180,
      opacity: 0,
      scale: 0.2,
      duration: 0.7,
      ease: 'back.out(1.7)',
    });
  }
}
