import { Component, OnInit, Input } from '@angular/core';
import { MDTs } from '../mdts.model';
import { MdtsFormComponent } from '../mdts-form/mdts-form.component';
import { EditMdtsState } from '../mdts-form/edit-mdts.state';
import { ModalService } from '@lib/shared/components/modal/modal.service';

@Component({
    selector: 'app-mdts-card-row',
    templateUrl: './mdts-card-row.component.html',
    styleUrls: ['./mdts-card-row.component.scss'],
})
export class MdtsCardRowComponent implements OnInit {
    @Input() mdt: MDTs;
    constructor(readonly modalService: ModalService) {}

    ngOnInit() {}

    startMdtsEdit(mdts: MDTs) {
        const editMessageTemp = this.modalService.create<MdtsFormComponent>(
            MdtsFormComponent,
            {
                state: new EditMdtsState(),
                id: mdts.id,
                mdts,
            },
        );
        editMessageTemp.open();
    }
}
