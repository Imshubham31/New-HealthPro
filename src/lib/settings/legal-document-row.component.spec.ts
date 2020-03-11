import { LocalisedDatePipe } from './../shared/services/localise-date.pipe';
import { ModalService } from './../shared/components/modal/modal.service';
import { LegalDocumentRowComponent } from './legal-document-row.component';
import { LocaliseModule } from '@lib/localise/localise.module';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { DatefunctionsPipe } from '@lib/shared/services/datefunctions.pipe';

let component: LegalDocumentRowComponent;
let fixture: ComponentFixture<LegalDocumentRowComponent>;

const openSpy = jasmine.createSpy();
describe('Legal Document Row Component', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule],
            declarations: [
                LegalDocumentRowComponent,
                LocalisedDatePipe,
                DatefunctionsPipe,
            ],
            providers: [
                {
                    provide: ModalService,
                    useValue: {
                        create: () => ({
                            open: openSpy,
                        }),
                    },
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
        fixture = TestBed.createComponent(LegalDocumentRowComponent);
        component = fixture.componentInstance;
        component.document = {
            consentDocument: {
                title: '',
                body: '',
                key: '',
                version: '',
                documentId: '',
            },
            acceptedDocument: {
                key: '',
                revision: '',
                documentId: '',
                dateAccepted: '',
            },
        };
        fixture.detectChanges();
    });
    xit('should open modal', () => {
        component.showDocModal();
        expect(openSpy).toHaveBeenCalled();
    });
});
