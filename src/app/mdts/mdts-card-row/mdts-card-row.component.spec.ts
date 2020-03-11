import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import SpyObj = jasmine.SpyObj;
import { MdtsCardRowComponent } from './mdts-card-row.component';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { LocaliseModule } from '@lib/localise/localise.module';
import { TestMDTs } from 'test/support/test-mdts';

describe('MdtsCardRowComponent', () => {
    let component: MdtsCardRowComponent;
    let fixture: ComponentFixture<MdtsCardRowComponent>;
    let modalService: SpyObj<ModalService>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [LocaliseModule],
            declarations: [MdtsCardRowComponent],
            providers: [
                {
                    provide: ModalService,
                    useValue: jasmine.createSpyObj('modalService', ['create']),
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MdtsCardRowComponent);
        component = fixture.componentInstance;
        modalService = TestBed.get(ModalService);
        modalService.create.and.returnValue({ open: () => {} });
        component.mdt = TestMDTs.buildMdts();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should startMdtsEdit called', () => {
        component.startMdtsEdit(TestMDTs.buildMdts());
        expect(modalService.create).toHaveBeenCalled();
    });
});
