import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalControls } from '@lib/shared/components/modal/modal.service';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { LocaliseService } from '@lib/localise/localise.service';
import { BaseForm, SetsUpForm } from '@lib/shared/services/base-form';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { RegistrationCodeService, HospitalCodes } from '../registration-code.service';
import { HospitalCodeService } from '../hospital-code.service';
import { HospitalCodeOption } from '../hospital-code-rest.service';


@Component({
  selector: 'app-generate-registration-code',
  templateUrl: './generate-registration-code.component.html',
  styleUrls: ['./generate-registration-code.component.scss']
})
export class GenerateRegistrationCodeComponent extends BaseForm
  implements OnInit, ModalControls, SetsUpForm {
  localiseService: LocaliseService;
  @ViewChild('modal', { static: true }) modal: ModalWrapperComponent;
  @Input() excludeIds: string[] = [];
  form: FormGroup;
  public displayCodeGenerationForm = true;
  codes;
  hospitalCodeOptions: HospitalCodeOption;

  open() {
    this.modal.openModal();
  }
  close() {
    this.modal.closeModal();
  }

  constructor(
    public localise: LocaliseService,
    public fb: FormBuilder,
    private registrationCodeService: RegistrationCodeService,
    public hospitalCodeService: HospitalCodeService,
  ) {
    super();
    this.setHospitalCodeOptions();
  }

  ngOnInit() {
    this.setupForm();
  }

  setHospitalCodeOptions() {
    this.hospitalCodeService.getHospitalCodes().subscribe(result => {
      this.hospitalCodeOptions = result;
    });
  }

  finish() {
    this.modal.closeModal();
  }
  protected buildControls() {
    const controls = {
      hospitalCode: ['', [Validators.required]]
    };

    return controls;
  }

  setupForm(): void {
    this.form = this.fb.group(this.buildControls());
  }

  showGeneratedCode() {
    const hospitalCode: HospitalCodes = { hospitalCode: this.form.value.hospitalCode };
    this.registrationCodeService.postRegistrationCode(hospitalCode).subscribe(data => {
      this.codes = data;
      this.displayCodeGenerationForm = false;
    });
  }

  copyTextToClipboard(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
