import { Component, ElementRef, Input, ViewChild, AfterViewInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class CardComponent implements AfterViewInit {
  @Input({ required: true }) image!: string;

  @ViewChild('cardRef') cardRef!: ElementRef;

  ngAfterViewInit(): void {
    gsap.from(this.cardRef.nativeElement, {
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
