import { MDTService } from '../../../mdt/mdt.service';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { Hcp } from '../../../hcp/hcp.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VirtualScroll } from '@lib/utils/virtual-scroll';
import { MDT } from 'app/mdt/mdt.model';

@Component({
    selector: 'view-hcps',
    templateUrl: './view-hcps.component.html',
    styleUrls: ['./view-hcps.component.scss'],
})
export class ViewHcpsComponent extends VirtualScroll implements OnInit {
    @Input() mdts: MDT[];
    @Output() editMDT: EventEmitter<Hcp[]> = new EventEmitter();
    authenticationService = AuthenticationService;

    constructor(private mdtService: MDTService) {
        super();
    }

    ngOnInit() {
        this.mdtService.mdtEdited.subscribe(edited => {
            if (!edited) {
                return;
            }
            this.mdts.forEach(function(mdt, index) {
                if (this[index].id === edited.id) {
                    this[index] = edited;
                }
            }, this.mdts);
        });
    }
}
