import { Component, Input } from '@angular/core';

@Component({
    selector: 'page-container',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.scss'],
})
export class PageComponent {
    @Input() title: string;
    // @Input() type = 'normal';

    // getLayout() {
    //     const layout = {
    //         normal: 'col-8 col-xl-12',
    //         narrow: 'col-6 col-lg-12',
    //     };
    //     return layout[this.type];
    // }
}
