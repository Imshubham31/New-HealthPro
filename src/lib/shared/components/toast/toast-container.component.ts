import { animate, style, transition, trigger } from '@angular/animations';
import { ToastService, ToastStyles } from './toast.service';
import { Component } from '@angular/core';

@Component({
    selector: 'toast-container',
    templateUrl: './toast-container.component.html',
    styleUrls: ['./toast-container.component.scss'],
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({ transform: 'translateY(-10px)', opacity: 0 }),
                animate(
                    '.3s',
                    style({ transform: 'translateY(0)', opacity: 1 }),
                ),
            ]),
            transition(':leave', [
                style({ opacity: 1 }),
                animate('.2s', style({ marginTop: '-100px', opacity: 0 })),
            ]),
        ]),
    ],
})
export class ToastContainerComponent {
    toastStyles = ToastStyles;
    constructor(public toastService: ToastService) {}
}
