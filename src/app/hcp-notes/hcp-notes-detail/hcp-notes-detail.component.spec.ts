import { ActivatedRoute } from '@angular/router';
import { HcpNote } from './../hcp-notes.model';
import { TestBed } from '@angular/core/testing';
import { HcpNotesDetailComponent } from './hcp-notes-detail.component';
import { TestHCPs } from 'test/support/test-hcps';
import { LocaliseService } from '@lib/localise/localise.service';
import { MockLocalisePipe } from 'test/support/mock-localise.pipe';
import { Languages } from '@lib/localise/languages';
import { LocalisedDatePipe } from '@lib/shared/services/localise-date.pipe';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { RestrictProcessingPipe } from '@lib/shared/services/restricted-user.pipe';
import { HcpNotesService } from '../hcp-notes.service';
import { of } from 'rxjs';
import { DatefunctionsPipe } from '@lib/shared/services/datefunctions.pipe';
describe('HcpNotesDetailComponent', () => {
    let component;
    let service: jasmine.SpyObj<HcpNotesService>;
    const lang = {
        strings: {
            consultationNoteCreatedBy: (params: string[]) =>
                `Created: ${params[0]} by ${params[1]}`,
            assignedRole: (params: string[]) =>
                `Assigned ${params[0]} (inactive)`,
            unknownUser: 'unknownUser',
        },
        dir: 'ltr',
    };
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            providers: [
                LocaliseService,
                LocalisedDatePipe,
                DatefunctionsPipe,
                ModalService,
                RestrictProcessingPipe,
                {
                    provide: Languages,
                    useValue: { en: lang },
                },
                {
                    provide: HcpNotesService,
                    useValue: jasmine.createSpyObj('hcpNotesService', [
                        'getNote$',
                    ]),
                },
                {
                    provide: ActivatedRoute,
                    useValue: { params: of({}) },
                },
            ],
            declarations: [
                HcpNotesDetailComponent,
                MockLocalisePipe,
                RestrictProcessingPipe,
                LocalisedDatePipe,
                DatefunctionsPipe
            ],
        });
    });

    beforeEach(() => {
        component = TestBed.createComponent(HcpNotesDetailComponent)
            .componentInstance;
        const localiseService = TestBed.get(LocaliseService);
        localiseService.use('en');
        service = TestBed.get(HcpNotesService);
    });

    describe('createdBy', () => {
        it('should display full name if unrestricted', () => {
            const testNote = buildNote(new Date(2017, 0, 1, 7, 0, 0));
            service.getNote$.and.returnValue(of(testNote));
            expect(
                component.createdBy(
                    testNote.created.datetime,
                    testNote.created,
                ),
            ).toBe(
                `Created: Jan 1, 2017 by ${testNote.created.firstName} ${
                    testNote.created.lastName
                }`,
            );
        });
        it('should display obfuscated name if restricted', () => {
            const testNote = buildNote(new Date(2017, 0, 1, 7, 0, 0), true);
            service.getNote$.and.returnValue(of(testNote));
            expect(
                component.createdBy(
                    testNote.created.datetime,
                    testNote.created,
                ),
            ).toBe(
                `Created: Jan 1, 2017 by Assigned ${
                    testNote.created.role
                } (inactive)`,
            );
        });
    });

    function buildNote(datetime: Date, isRestricted = false) {
        const hcp = TestHCPs.createDrCollins();
        return new HcpNote('title', 'body', 'patientId', {
            id: hcp.backendId,
            datetime,
            firstName: hcp.firstName,
            lastName: hcp.firstName,
            role: hcp.role,
            isRestricted,
        });
    }
});
