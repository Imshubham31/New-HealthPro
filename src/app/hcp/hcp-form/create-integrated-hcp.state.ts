import { Validators } from '@angular/forms';
import { NoWhitespaceValidator } from '@lib/utils/validators';
import { CreateHcpState } from './create-hcp.state';

export class CreateIntegratedHcpState extends CreateHcpState {
    protected buildControls() {
        const controls = super.buildControls();
        controls['mrn'] = ['', [Validators.required, NoWhitespaceValidator()]];
        return controls;
    }

    protected buildHcp() {
        const formModel = this.context.form.value;
        const newHcp = super.buildHcp();
        newHcp.integrated = { mrn: formModel.mrn };
        return newHcp;
    }
}
