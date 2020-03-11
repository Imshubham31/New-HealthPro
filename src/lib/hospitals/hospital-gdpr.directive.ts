import { TemplateRef, ViewContainerRef } from '@angular/core';
import { HospitalService } from './hospital.service';
import { Input } from '@angular/core';
import { Directive } from '@angular/core';

@Directive({
    selector: '[gdpr]',
})
export class HospitalGdprDirective {
    private gdprKey;
    private gdprVals;
    @Input()
    set gdpr(val) {
        this.gdprKey = val;
        this.reRender();
    }

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private hospitalService: HospitalService,
    ) {
        this.viewContainer.clear();
        this.hospitalService.fetchHospital().subscribe(res => {
            this.gdprVals = res;
            this.reRender();
        });
    }
    reRender() {
        if (this.gdprVals && this.gdprKey && this.gdprVals[this.gdprKey]) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }
}

export const GDPR_CONSTANTS = {
    EXPORT_MY_DATA: 'showExportMyData',
    RIGHT_TO_BE_FORGOTTEN: 'showRightToBeForgotten',
    RIGHT_TO_RESTRICT_PROCESSING_DATA: 'showRestrictToProcessData',
};
