import { ViewChild, HostListener, AfterViewChecked } from '@angular/core';
export abstract class VirtualScroll implements AfterViewChecked {
    @ViewChild('virtualScroll', { static: true }) virtualScroll: any;
    viewPortItems = [];
    height = '0px';
    scrollHeight() {
        if (!this.virtualScroll) {
            return '0px';
        }
        const scrollerPos = this.virtualScroll.element.nativeElement.getBoundingClientRect()
            .top;
        if (window.innerHeight - scrollerPos < 303) {
            return '303px';
        }
        return `${window.innerHeight - scrollerPos}px`;
    }

    ngAfterViewChecked() {
        this.refreshHeight();
    }

    @HostListener('window:resize', ['$event'])
    onResize(_event: any) {
        this.refreshHeight();
    }

    refreshHeight() {
        const calcHeight = this.scrollHeight();
        if (calcHeight !== this.height) {
            this.height = this.scrollHeight();
        }
    }
}
