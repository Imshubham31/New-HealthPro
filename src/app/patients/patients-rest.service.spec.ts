import { TestPatients } from 'test/support/test-patients';
import { TestBed } from '@angular/core/testing';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClientModule, HttpRequest } from '@angular/common/http';

import { PatientsRestService } from './patients-rest.service';
import { TestNotes } from 'test/support/test-notes';
import { MdtsHcps } from './patient.model';

describe('PatientsRestService', () => {
    let restService: PatientsRestService;
    let mockBackend: HttpTestingController;

    const tracer = { data: {} };

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [PatientsRestService],
        });

        restService = TestBed.get(PatientsRestService);
        mockBackend = TestBed.get(HttpTestingController);
    });

    describe('#getAppointments(id)', () => {
        it('should GET the appointments from patient appointments endpoint', () => {
            const id = '42';

            restService
                .getAppointments(id)
                .take(1)
                .subscribe(response => {
                    expect(response).toBe(tracer.data as any);
                });

            mockBackend
                .expectOne((req: HttpRequest<any>) => {
                    expect(req.method).toEqual('GET');
                    expect(req.url).toContain(`patients/${id}/appointments`);
                    return true;
                })
                .flush(tracer);
            mockBackend.verify();
        });
    });

    describe('#getGoals(id)', () => {
        it('should GET the goals from the patient goals endpoint', () => {
            const id = '42';

            restService
                .getGoals(id)
                .take(1)
                .subscribe(response => {
                    expect(response).toBe(tracer.data as any);
                });

            mockBackend
                .expectOne((req: HttpRequest<any>) => {
                    expect(req.method).toEqual('GET');
                    expect(req.url).toContain(`patients/${id}/goals`);
                    return true;
                })
                .flush(tracer);
            mockBackend.verify();
        });
    });

    describe('#updateHeight(patientId, height)', () => {
        it('should POST { height } to patients medical records endpoint', () => {
            const id = '42';
            const height = 42;

            restService.updateHeight(id, height).subscribe();

            mockBackend.expectOne((req: HttpRequest<any>) => {
                expect(req.method).toEqual('POST');
                expect(req.url).toContain(`patients/${id}/medicalrecords`);
                expect(req.body).toEqual({ height });
                return true;
            });
            mockBackend.verify();
        });
    });

    describe('#getLatestHeight(patientId)', () => {
        it('should get latest height', () => {
            const id = '1';
            restService.getLatestHeight(id).subscribe();
            mockBackend.expectOne((req: HttpRequest<any>) => {
                expect(req.method).toEqual('GET');
                expect(req.url).toContain(`patients/${id}/medicalrecords`);
                return true;
            });
            mockBackend.verify();
        });
    });
    describe('#findConsultationNotes(patientId: string)', () => {
        it('should find consultation notes', () => {
            const patientId = '1';
            restService.findConsultationNotes(patientId).subscribe();
            mockBackend.expectOne((req: HttpRequest<any>) => {
                expect(req.method).toEqual('GET');
                expect(req.url).toContain(`/${patientId}/consultation-notes`);
                return true;
            });
            mockBackend.verify();
        });
    });
    describe('#createConsultationNote(patientId: string)', () => {
        it('should create consultation note', () => {
            const patientId = '1';
            const note = TestNotes.build();
            restService.createConsultationNote(patientId, note).subscribe();
            mockBackend.expectOne((req: HttpRequest<any>) => {
                expect(req.method).toEqual('POST');
                expect(req.url).toContain(`/${patientId}/consultation-notes`);
                expect(req.body).toEqual(note);
                return true;
            });
            mockBackend.verify();
        });
    });
    describe('#updateConsultationNote(patientId: string)', () => {
        it('should update consultation note', () => {
            const hcpNote = TestNotes.build();
            const reason = 'because';
            restService.updateConsultationNote(hcpNote, reason).subscribe();
            mockBackend.expectOne((req: HttpRequest<any>) => {
                expect(req.method).toEqual('PUT');
                expect(req.url).toContain(
                    `/${hcpNote.patientId}/consultation-notes/${hcpNote.id}`,
                );
                expect(req.body).toEqual(hcpNote);
                return true;
            });
            mockBackend.verify();
        });
    });

    describe('#changePathway', () => {
        it('should change pathway', () => {
            const patient = TestPatients.build();

            const mdtsHcps = MdtsHcps.fromMDts(patient.mdts);
            const payload = {
                pathwayId: '2',
                caremoduleId: '1',
                surgery: patient.surgery,
                personalMdt: mdtsHcps.personalMdt,
                sharedMdtIds: mdtsHcps.sharedMdtIds,
            };
            restService.changePathway(patient.backendId, payload).subscribe();
            mockBackend.expectOne((req: HttpRequest<any>) => {
                expect(req.method).toEqual('POST');
                expect(req.url).toContain(
                    `/${patient.backendId}/switch-pathway`,
                );
                expect(req.body).toEqual(payload);
                return true;
            });
            mockBackend.verify();
        });
    });
});
