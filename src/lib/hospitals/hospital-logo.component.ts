import { Component, Input, OnInit } from '@angular/core';
import { HospitalService } from './hospital.service';

@Component({
    selector: 'hospital-logo',
    template: `
        <div
            class="logo-container"
            [class.logo_centered]="center"
            [class.logo_at_start]="!center"
        >
            <img [src]="logoPath" />
        </div>
    `,
    styleUrls: ['./hospital-logo.component.scss'],
})
export class HospitalLogoComponent implements OnInit {
    @Input()
    center: Boolean;

    logoPath: String;

    constructor(public hospitalService: HospitalService) {}

    ngOnInit() {
        this.logoPath = '';
        this.hospitalService.fetchHospital().subscribe(res => {
            this.logoPath = res.logos.web;
        });
    }
}
