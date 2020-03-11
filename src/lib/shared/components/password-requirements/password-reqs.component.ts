import { Component } from '@angular/core';

@Component({
    selector: 'password-requirements',
    templateUrl: './password-reqs.component.html',
    styleUrls: ['./password-reqs.component.scss'],
})
export class PasswordRequirementsComponent {
    symbols = '{}[],.<> ;:‘“?/|`~! @#$%^&*() _-+=';
}
