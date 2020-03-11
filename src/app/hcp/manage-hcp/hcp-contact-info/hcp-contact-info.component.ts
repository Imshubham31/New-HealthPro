import { Component, Input } from '@angular/core';
import { Hcp } from '../../hcp.model';

@Component({
    selector: 'hcp-contact-info',
    templateUrl: './hcp-contact-info.component.html',
    styleUrls: ['./hcp-contact-info.component.scss'],
})
export class HcpContactInfoComponent {
    @Input() hcpData: Hcp;
}
