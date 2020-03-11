import { Component, Input } from '@angular/core';
import { MDT } from 'app/mdt/mdt.model';
import { Hcp } from 'app/hcp/hcp.model';

@Component({
    selector: 'app-mdt-members',
    template: `
        <div class="columns">
            <span class="display-contents">
                <div
                    class="column col-4 center-text"
                    *ngFor="let mdtMember of uniqueHcps"
                >
                    <div class="columns">
                        <avatar-img
                            class="column col-3"
                            [size]="'6rem'"
                            [user]="mdtMember"
                        ></avatar-img>
                        <div
                            class="column"
                            [class.restricted]="mdtMember.isRestricted"
                        >
                            <strong>{{ mdtMember | restricted }}</strong>
                            <p
                                class="gray-text"
                                *ngIf="!mdtMember.isRestricted"
                            >
                                {{ mdtMember.role }}
                            </p>
                        </div>
                    </div>
                </div>
            </span>
        </div>
    `,
    styleUrls: ['./mdt-members.component.scss'],
})
export class MdtMembersComponent {
    @Input() mdts: MDT[];
    get uniqueHcps() {
        const hcps = [];
        if (!this.mdts || this.mdts.length === 0) {
            return hcps;
        }
        const uniqIds = {};
        this.mdts.forEach((mdt: MDT) => {
            mdt.hcps.forEach((hcp: Hcp) => {
                if (!uniqIds[hcp.backendId]) {
                    uniqIds[hcp.backendId] = true;
                    hcps.push(hcp);
                }
            });
        });
        return hcps;
    }
}
