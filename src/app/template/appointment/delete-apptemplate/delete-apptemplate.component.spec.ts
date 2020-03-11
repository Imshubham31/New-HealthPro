import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteApptemplateComponent } from './delete-apptemplate.component';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { AppointmentService } from './../../appointment.service';
import { Languages } from '@lib/localise/languages';
import { HospitalsRestService } from '@lib/hospitals/hospital-rest.service';
import { LocaliseService } from '@lib/localise/localise.service';
import SpyObj = jasmine.SpyObj;
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { Localise } from '@lib/localise/localise.pipe';

describe('DeleteApptemplateComponent', () => {
    let component: DeleteApptemplateComponent;
    let fixture: ComponentFixture<DeleteApptemplateComponent>;
    let appointmentService: SpyObj<AppointmentService>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            declarations: [
                DeleteApptemplateComponent,
                ModalWrapperComponent,
                Localise,
            ],
            providers: [
                {
                    provide: HospitalsRestService,
                    useClass: HospitalsRestService,
                },
                { provide: LocaliseService, useClass: LocaliseService },
                {
                    provide: Languages,
                    useValue: { en: '' },
                },
                {
                    provide: AppointmentService,
                    useValue: jasmine.createSpyObj('appointmentService', [
                        'deleteAppointmentTemplate',
                    ]),
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DeleteApptemplateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        appointmentService = TestBed.get(AppointmentService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open the modal', () => {
        const spy = spyOn(component.modal, 'openModal');
        component.open();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should close the modal', () => {
        const spy = spyOn(component.modal, 'closeModal');
        component.close();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('delete appointemnt', () => {
        component.onSuccess = jasmine.createSpyObj('onSuccess', ['next']);
        appointmentService.deleteAppointmentTemplate.and.returnValues(of({}));
        component.deleteappointment();
        fixture.detectChanges();
        expect(component.onSuccess.next).toHaveBeenCalled();
    });
});
