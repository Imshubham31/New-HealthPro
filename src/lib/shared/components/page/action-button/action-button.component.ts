import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'page-action-button',
    templateUrl: './action-button.component.html',
    styles: [':host { display: block }'],
})
export class PageActionButtonComponent {
    @Input() class = 'primary';
    @Input() icon: string;
    @Input() text: string;
    @Input() disabled = false;

    @Output() onClick = new EventEmitter<void>();

    handleButtonClick() {
        this.onClick.next();
    }
}
