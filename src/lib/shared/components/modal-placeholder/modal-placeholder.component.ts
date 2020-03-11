import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { ModalService } from '@lib/shared/components/modal/modal.service';

@Component({
    selector: 'modal-placeholder',
    template: '<div #modalComponentContainer></div>',
})
export class ModalPlaceholderComponent implements OnInit {
    @ViewChild('modalComponentContainer', {
        read: ViewContainerRef,
        static: true,
    })
    modalComponentContainer: ViewContainerRef;
    constructor(private modalService: ModalService) {}

    ngOnInit(): void {
        this.modalService.registerViewContainerRef(
            this.modalComponentContainer,
        );
    }
}
