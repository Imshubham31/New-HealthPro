import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateRegistrationCodeComponent } from './generate-registration-code.component';
import { Localise } from '@lib/localise/localise.pipe';
import { DatefunctionsPipe } from '@lib/shared/services/datefunctions.pipe';
import { LocaliseService } from '@lib/localise/localise.service';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Languages } from '@lib/localise/languages';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { of } from 'rxjs';
import { User } from '@lib/authentication/user.model';
import { HospitalCodeService } from '../hospital-code.service';

const formBuilder: FormBuilder = new FormBuilder();

describe('GenerateRegistrationCodeComponent', () => {
  let component: GenerateRegistrationCodeComponent;
  let fixture: ComponentFixture<GenerateRegistrationCodeComponent>;
  const mockHospital = new User();
  mockHospital.hospitalId = 'hospitalId';
  const hospitalCode = [{
    hospitalUuid: '',
    pathway: {
      uuid: '',
      title: '',
    },
    caremodule: {
      uuid: '',
      title: '',
    },
    hospitalCode: '',
  }];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientModule
      ],
      declarations: [GenerateRegistrationCodeComponent,
        Localise,
        ModalWrapperComponent,
        DatefunctionsPipe
      ],
      providers: [
        { provide: LocaliseService, useClass: LocaliseService },
        { provide: FormBuilder, useValue: formBuilder },
        {
          provide: Languages,
          useValue: { en: '' },
        },
        {
          provide: HospitalCodeService,
          useValue: {
            getHospitalCodes
              : () => {
                return of(hospitalCode);
              },
          },
        },

      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateRegistrationCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(AuthenticationService, 'getUser').and.returnValue({
      hospitalId: mockHospital.hospitalId,
    });
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

  it('click on the cancel button to close modal', () => {
    const spy = spyOn(component.modal, 'closeModal');
    component.finish();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('copy text to clipboard', () => {
    component.copyTextToClipboard('');
  });
});
