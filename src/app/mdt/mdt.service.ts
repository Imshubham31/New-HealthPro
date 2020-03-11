import { map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Hcp } from '../hcp/hcp.model';
import { LocaliseService } from '@lib/localise/localise.service';
import {
    ToastService,
    ToastStyles,
} from '@lib/shared/components/toast/toast.service';
import { MDTRestService } from './mdt-rest.service';
import { MDT } from './mdt.model';

@Injectable()
export class MDTService {
    mdtEdited: Subject<MDT> = new Subject();

    constructor(
        private mdtRestService: MDTRestService,
        private toastService: ToastService,
        private localiseService: LocaliseService,
    ) {}

    assignMdtTo(patientId: string, mdtToCreate: MDT) {
        const mdtMapped = {
            ...mdtToCreate,
            hcps: mdtToCreate.hcps.map(hcp => hcp.backendId),
            patients: [patientId],
        };
        return this.mdtRestService.create(mdtMapped).pipe(
            map(
                res =>
                    ({
                        ...mdtToCreate,
                        id: res.resourceId,
                    } as MDT),
            ),
        );
    }

    updateMDT(mdt: MDT): Observable<any> {
        return this.mdtRestService
            .patch(mdt.id, {
                hcps: mdt.hcps.map(val => val.backendId),
                name: mdt.name,
            })
            .pipe(
                tap(
                    response => {
                        this.toastService.show(
                            null,
                            this.localiseService.fromKey('successEditMDT'),
                        );
                        this.mdtEdited.next(mdt);
                    },
                    error => {
                        this.toastService.show(
                            null,
                            this.localiseService.fromKey('failEditMDT'),
                            ToastStyles.Error,
                        );
                        this.mdtEdited.error(null);
                    },
                ),
            );
    }

    addHcpToMDT(mdt: MDT, hcps: Hcp[]): Observable<any> {
        const allHcps = [...hcps, ...mdt.hcps];
        return this.mdtRestService
            .patch(mdt.id, { hcps: allHcps.map(n => n.backendId) })
            .pipe(
                map(
                    response => {
                        this.toastService.show(
                            null,
                            this.localiseService.fromKey('successEditMDT'),
                        );
                        mdt.hcps = allHcps;
                        return this.mdtEdited.next(mdt);
                    },
                    error => {
                        this.toastService.show(
                            null,
                            this.localiseService.fromKey('failEditMDT'),
                            ToastStyles.Error,
                        );
                    },
                ),
            );
    }
}
