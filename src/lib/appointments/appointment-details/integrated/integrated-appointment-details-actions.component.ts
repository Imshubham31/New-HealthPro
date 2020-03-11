import { Component } from '@angular/core';

@Component({
    template: `
        <page-popover [body]="'disabledAppointmentActionMessage' | localise">
            <div class="btn-group options">
                <button disabled class="btn btn-link link edit">
                    {{ 'edit' | localise }}
                </button>
                <button disabled class="btn btn-link delete underline">
                    {{ 'delete' | localise }}
                </button>
            </div>
        </page-popover>
    `,
    styleUrls: ['../appointment-details-actions.component.scss'],
})
export class IntegratedAppointmentDetailsActionsComponent {}
