import { of } from 'rxjs';
import { finalize, catchError, tap } from 'rxjs/operators';
import { Validators } from '@angular/forms';
import { MdtsFormContext, MdtsFormState } from './mdts-form';
import { MDTs } from '../mdts.model';

export class EditMdtsState implements MdtsFormState {
    context: MdtsFormContext;
    id: string;
    get title() {
        return `${this.context.localiseService.fromKey('editTeam')} ${
            this.context.mdts.name
        }`;
    }

    submit() {
        this.context.submit();
        this.context.submitting = true;
        this.context.errors = [];
        this.context.mdts = this.buildMdts();
        this.context.mdtsService
            .updateMdts(this.context.id, this.buildMdts())
            .pipe(
                tap(() => {
                    this.context.onSuccess.next();
                    this.context.finish();
                    this.context.mdtsService.getMdts$();
                }),
                catchError(error => {
                    this.context.errors = [error.error];
                    return of(error);
                }),
                finalize(() => (this.context.submitting = false)),
            )
            .subscribe();
    }

    setupForm(): void {
        const controls = {
            name: [this.context.mdts.name, [Validators.required]],
            HCPs: [this.context.mdts.hcps, [Validators.required]],
        };

        this.context.form = this.context.fb.group(controls);
    }

    protected buildMdts() {
        const mdts: MDTs = new MDTs();
        const formModel = this.context.form.value;
        mdts.name = formModel.name;
        mdts.hcps = this.getHCPsIds(formModel.HCPs);
        return mdts;
    }

    getHCPsIds(hcps) {
        const hcpsId = [];
        hcps.forEach(hcp => {
            hcpsId.push(hcp.id);
        });
        return hcpsId;
    }
}
