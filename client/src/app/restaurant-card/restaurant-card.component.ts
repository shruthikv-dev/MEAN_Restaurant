// restaurant-card/restaurant-card.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-restaurant-card',
    templateUrl: './restaurant-card.component.html',
    standalone: true,
    imports: [CommonModule]
})
export class RestaurantCardComponent {
    @Input() restaurant: any;
}