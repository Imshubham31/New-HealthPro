import { SearchInputComponent } from './../../../lib/shared/components/search-input/search-input.component';
import { EditHcpState } from './../hcp-form/edit-hcp.state';
import { CreateIntegratedHcpState } from './../hcp-form/create-integrated-hcp.state';
import { HcpFormComponent } from './../hcp-form/hcp-form.component';
import { HospitalService } from '@lib/hospitals/hospital.service';
import { HcpService } from 'app/hcp/hcp.service';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { ManageHcpComponent } from './manage-hcp.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LocaliseModule } from '@lib/localise/localise.module';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { PaginationService } from 'ngx-pagination';
import { CreateHcpState } from '../hcp-form/create-hcp.state';
import { TestHCPs } from 'test/support/test-hcps';
import SpyObj = jasmine.SpyObj;
import { of } from 'rxjs';
import { BehaviorSubject } from 'rxjs/Rx';
let component: ManageHcpComponent;
let fixture: ComponentFixture<ManageHcpComponent>;
let modalService: SpyObj<ModalService>;
const paginationResult = [
    { isActive: true },
    { isActive: false },
    { isActive: true },
];

@Pipe({ name: 'paginate' })
class MockPaginationsPipe implements PipeTransform {
    transform(value: any[], args: any): any[] {
        return paginationResult;
    }
}
function setupTestBed() {
    TestBed.configureTestingModule({
        imports: [CommonModule, LocaliseModule],
        declarations: [
            ManageHcpComponent,
            MockPaginationsPipe,
            SearchInputComponent,
        ],
        providers: [
            {
                provide: HcpService,
                useValue: {
                    fetchHcps: () => of(),
                    getHCPs$: () => of([]),
                    store$: of({
                        list: [],
                    }),
                },
            },
            {
                provide: HospitalService,
                useValue: {
                    fetchHospital: () => of(),
                    hospital: new BehaviorSubject({
                        name: 'test',
                        integrated: false,
                    }),
                },
            },
            {
                provide: ModalService,
                useValue: jasmine.createSpyObj('modalService', ['create']),
            },
            { provide: PaginationService, useValue: {} },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });
}

describe('Manage Hcp Component', () => {
    configureTestSuite(() => {
        setupTestBed();
    });
    beforeEach(() => {
        fixture = TestBed.createComponent(ManageHcpComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        modalService = TestBed.get(ModalService);
        modalService.create.and.returnValue({ open: () => {} });
    });
    it('should get hcp search fields', () => {
        expect(component.searchFields.length).toBeGreaterThan(0);
    });
    describe('behaviours', () => {
        it('should open create modal', () => {
            const input = fixture.debugElement.query(
                By.css('button.btn-primary'),
            ).nativeElement;
            input.click();
            expect(modalService.create).toHaveBeenCalledWith(HcpFormComponent, {
                state: new CreateHcpState(),
            });
        });
        it('should open create modal for integrated hospital', () => {
            component.hospitalService.hospital.value.integrated = true;
            const input = fixture.debugElement.query(
                By.css('button.btn-primary'),
            ).nativeElement;
            input.click();
            expect((component as any).modalService.create).toHaveBeenCalledWith(
                HcpFormComponent,
                {
                    state: new CreateIntegratedHcpState(),
                },
            );
        });
        it('should open edit modal', () => {
            const testHcp = TestHCPs.build();
            component.startHcpEdit(testHcp);
            expect((component as any).modalService.create).toHaveBeenCalledWith(
                HcpFormComponent,
                {
                    state: new EditHcpState(),
                    hcp: testHcp,
                },
            );
        });
        it('should display contact info correctly for active and inactive hcp', () => {
            const activeHcps = fixture.debugElement.queryAll(
                By.css('hcp-action-card'),
            );
            const inactiveHcps = fixture.debugElement.queryAll(
                By.css('.hcp-actions-icon'),
            );
            expect(activeHcps.length).toBe(2);
            expect(inactiveHcps.length).toBe(1);
        });
    });
});
