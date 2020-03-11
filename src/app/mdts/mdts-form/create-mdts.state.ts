import { of } from 'rxjs';
import { finalize, catchError, tap } from 'rxjs/operators';
import { Validators } from '@angular/forms';
import { MDTs } from '../mdts.model';
import { MdtsFormState, MdtsFormContext } from './mdts-form';

export class CreateMdtsState implements MdtsFormState {
    context: MdtsFormContext;
    id: string;
    get title() {
        return `${this.context.localiseService.fromKey(
            'addANewMDTToThePlatform',
        )}`;
    }

    submit(): void {
        this.context.submit();
        this.context.errors = [];
        this.context.submitting = true;
        this.context.mdts = this.buildMdts();
        this.context.mdtsService
            .createMdts(this.buildMdts())
            .pipe(
                tap(success => {
                    this.context.onSuccess.next();
                    this.context.finish();
                }),
                catchError(err => {
                    this.context.errors.push(err.error);
                    return of(err);
                }),
                finalize(() => (this.context.submitting = false)),
            )
            .subscribe(next => {
                this.context.mdtsService.fetchMdtsWithOutCache().subscribe();
            });
    }

    protected buildControls() {
        return {
            name: ['', [Validators.required]],
            HCPs: ['', [Validators.required]],
        };
    }

    setupForm(): void {
        this.context.form = this.context.fb.group(this.buildControls());
    }

    protected buildMdts() {
        const mdts: MDTs = new MDTs();
        const formModel = this.context.form.value;
        mdts.name = formModel.name;
        mdts.hcps = this.getHCPsIds(formModel.HCPs);
        mdts.hospitalId = formModel.HCPs[0].hospitalId;
        mdts.personal = false;
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
