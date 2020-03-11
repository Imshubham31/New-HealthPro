import { Component, Input } from '@angular/core';
import { Hcp } from 'app/hcp/hcp.model';

@Component({
    selector: 'hcp-overview',
    template: `
        <div class="columns col-12">
            <avatar-img
                class="column col-4 col-lg-12"
                size="10rem"
                [user]="hcpData"
            ></avatar-img>
            <div class="column hcps-container">
                <h5 class="patient-name">
                    {{ hcpData.firstName }} {{ hcpData.lastName }}
                </h5>
                <p class="gray-text">{{ hcpData.locationName }}</p>
                <p class="padding-top-1 text-capitalize">{{ hcpData.role }}</p>
            </div>
        </div>
    `,
    styleUrls: ['./hcp-overview.component.scss'],
})
export class HcpOverviewComponent {
    @Input() hcpData: Hcp;
}
