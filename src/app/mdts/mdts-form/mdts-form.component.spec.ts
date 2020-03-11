import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MdtsFormComponent } from './mdts-form.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { CommonModule } from '@angular/common';
import { LocaliseModule } from '@lib/localise/localise.module';
import { HcpService } from 'app/hcp/hcp.service';
import { of } from 'rxjs';
import { ToastService } from '@lib/shared/components/toast/toast.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MdtsService } from '../mdts.service';

xdescribe('MessageTempFormComponent', () => {
    let component: MdtsFormComponent;
    let fixture: ComponentFixture<MdtsFormComponent>;
    const formBuilder: FormBuilder = new FormBuilder();

    const mockTostService = {
        show: () => {},
    };
    const mockModal: ModalWrapperComponent = {
        openModal: () => {
            this.modalActive = true;
        },
        closeModal: () => {
            this.modalActive = false;
        },
        modalTitle: 'mockModalTitle',
        modalSubTitle: 'mockModalSubTitle',
        modalActive: false,
        modalWidth: '500px',
        modalBodyMaxHeight: '500px',
        showCloseBtn: true,
        modalFooter: null,
        onCloseModal: null,
        onOpenModal: null,
        callDestroy: () => {},
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule, LocaliseModule, ReactiveFormsModule],
            declarations: [MdtsFormComponent],
            providers: [
                { provide: FormBuilder, useValue: formBuilder },
                { provide: ToastService, useValue: mockTostService },
                {
                    provide: HcpService,
                    useValue: {
                        hcpService: of(),
                    },
                },
                {
                    provide: MdtsService,
                    useValue: {
                        mdtsService: of(),
                    },
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MdtsFormComponent);
        component = fixture.componentInstance;
        component.modal = mockModal;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
