import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'appointment-details-wrapper',
    template: `
        <appointment-details (onDelete)="handleDelete()"></appointment-details>
    `,
    styles: [
        `
            :host {
                padding: 5rem;
                display: block;
            }
        `,
    ],
})
export class AppointmentDetailsWrapperComponent {
    constructor(private router: Router, private route: ActivatedRoute) {}
    handleDelete() {
        this.router.navigate([
            `/appointments/user/${this.route.parent.snapshot.params.id}`,
            { outlets: { master: 'all', detail: null } },
        ]);
    }
}
