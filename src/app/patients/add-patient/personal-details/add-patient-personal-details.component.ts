import {
    AfterViewInit,
    EventEmitter,
    Output,
    ViewChild,
    OnInit,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { LocaliseService } from '@lib/localise/localise.service';
import { BaseForm, SetsUpForm } from '@lib/shared/services/base-form';
import { Masks } from '@lib/utils/masks';
import { AddPatientCoordinator } from '../add-patient-coordinator.service';
import { HospitalType } from '@lib/hospitals/hospital.model';

export abstract class AddPatientPersonalDetailsComponent extends BaseForm
    implements SetsUpForm, AfterViewInit, OnInit {
    @Output() onCancel = new EventEmitter();
    @ViewChild('inputField', { static: true }) inputField: any;
    abstract type: HospitalType;
    get locale() {
        return this.localise.getLocale();
    }

    constructor(
        protected fb: FormBuilder,
        protected addPatientCoordinator: AddPatientCoordinator,
        protected localise: LocaliseService,
    ) {
        super();
    }

    abstract setupForm();

    abstract buildPatient();

    ngOnInit() {
        this.setupForm();
    }

    ngAfterViewInit(): void {
        Masks.phone(this.inputField.nativeElement);
    }

    cancel() {
        super.cleanForm();
        this.addPatientCoordinator.onCancel$.next();
    }

    submit() {
        if (!this.form.valid) {
            return;
        }
        this.submitting = true;
        super.submit();
        this.addPatientCoordinator.savePersonalDetails(this.buildPatient());
        this.cleanForm();
    }

    shouldDisableSubmit$() {
        return !this.form.valid || this.submitting;
    }
}
