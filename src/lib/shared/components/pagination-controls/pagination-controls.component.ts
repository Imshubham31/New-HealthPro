import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation,
} from '@angular/core';

@Component({
    selector: 'app-pagination-controls',
    templateUrl: './pagination-controls.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class AppPaginationControlsComponent {
    @Input() id;
    @Input() maxSize = 7;
    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
}
