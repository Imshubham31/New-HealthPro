import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMessagetemplateComponent } from './delete-messagetemplate.component';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { Localise } from '@lib/localise/localise.pipe';
import { HttpClientModule } from '@angular/common/http';
import { HospitalsRestService } from '@lib/hospitals/hospital-rest.service';
import { LocaliseService } from '@lib/localise/localise.service';
import { Languages } from '@lib/localise/languages';
import { MessageService } from 'app/template/message.service';
import SpyObj = jasmine.SpyObj;
import { of } from 'rxjs';

describe('DeleteMessagetemplateComponent', () => {
    let component: DeleteMessagetemplateComponent;
    let fixture: ComponentFixture<DeleteMessagetemplateComponent>;
    let messageService: SpyObj<MessageService>;

    beforeEach(async(() => {
        // const spy = spyOn(messageService.deleteMessageTemplate, 'subscribe').and.callThrough();
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            declarations: [
                DeleteMessagetemplateComponent,
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
                    provide: MessageService,
                    useValue: jasmine.createSpyObj('messageService', [
                        'deleteMessageTemplate',
                    ]),
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DeleteMessagetemplateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        messageService = TestBed.get(MessageService);
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
        messageService.deleteMessageTemplate.and.returnValues(of({}));
        component.deleteappointment();
        fixture.detectChanges();
        expect(component.onSuccess.next).toHaveBeenCalled();
    });
});
