import { finalize } from 'rxjs/operators';
import {
    Component,
    EventEmitter,
    OnInit,
    Output,
    ViewChild,
    AfterViewInit,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as isEmpty from 'lodash/isEmpty';

import { AuthenticationService } from '@lib/authentication/authentication.service';
import { User } from '@lib/authentication/user.model';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import {
    ToastService,
    ToastStyles,
} from '@lib/shared/components/toast/toast.service';
import { BaseForm, SetsUpForm } from '@lib/shared/services/base-form';
import { Masks } from '@lib/utils/masks';
import { EditProfilePictureComponent } from './edit-profile-picture/edit-profile-picture.component';
import { EditUserService, UserEdit } from './edit-user.service';
import { LocaliseService } from '@lib/localise/localise.service';
import { AvatarImgComponent } from '@lib/shared/components/avatars/avatar-img.component';
import { Router } from '@angular/router';
import { HospitalService } from '@lib/hospitals/hospital.service';

@Component({
    selector: 'edit-user',
    templateUrl: 'edit-user.component.html',
    styleUrls: ['edit-user.component.scss'],
})
export class EditUserComponent extends BaseForm
    implements SetsUpForm, OnInit, AfterViewInit {
    @ViewChild('phoneNumberField', { static: true }) phoneNumberField: any;
    @ViewChild('avatar', { static: true }) avatar: AvatarImgComponent;
    @Output() updatedUserData: EventEmitter<Object> = new EventEmitter<User>();
    user: User;
    userChanged: User;
    dateformat = [];
    firstDayOfWeek = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
    ];

    get userRoles() {
        return [
            {
                value: 'surgeon',
                label: this.localiseService.fromKey('surgeon'),
            },
        ];
    }

    constructor(
        public editUserService: EditUserService,
        private fb: FormBuilder,
        public localiseService: LocaliseService,
        private toast: ToastService,
        private modalService: ModalService,
        private router: Router,
        private hospitalService: HospitalService,
    ) {
        super();
    }

    ngOnInit() {
        this.setupForm();
        this.getdateFormatList();
    }

    ngAfterViewInit(): void {
        Masks.phone(this.phoneNumberField.nativeElement);
    }

    setupForm(): void {
        this.user = AuthenticationService.getUser();
        const userRoleFromList = this.userRoles.find(
            role => role.value.toLowerCase() === this.user.role,
        );
        this.form = this.fb.group({
            firstName: [this.user.firstName, [Validators.required]],
            lastName: [this.user.lastName, [Validators.required]],
            gender: [this.user.gender, [Validators.required]],
            email: [
                { value: this.user.email, disabled: true },
                [Validators.required],
            ],
            phoneNumber: [
                this.user.phoneNumber,
                [Validators.required, Validators.minLength(3)],
            ],
            units: [this.user.units, [Validators.required]],
            existingRole: [userRoleFromList ? userRoleFromList.value : ''],
            otherRole: [!userRoleFromList ? this.user.role : ''],
            roleRadioSelection: [
                userRoleFromList ? 'existing' : 'other',
                [Validators.required],
            ],
            language: [this.user.language, [Validators.required]],
            firstDayOfWeek: [this.user.firstDayOfWeek],
            dateFormat: [this.user.dateFormat],
        });
        this.shouldDisableOther(userRoleFromList ? 'existing' : 'other');
        this.form.controls['roleRadioSelection'].valueChanges.subscribe(
            next => {
                this.shouldDisableOther(next);
            },
        );
    }

    finish() {
        this.setupForm();
    }

    submit() {
        if (!this.form.valid) {
            return;
        }
        super.submit();
        const editUser: UserEdit = {
            backendId: this.user.backendId,
            firstName: this.form.value.firstName,
            lastName: this.form.value.lastName,
            phoneNumber: this.form.value.phoneNumber,
            role:
                this.form.value.roleRadioSelection === 'existing'
                    ? this.form.value.existingRole
                    : this.form.value.otherRole,
            gender: this.form.value.gender,
            units: this.form.value.units,
            language: this.form.value.language,
            firstDayOfWeek: this.form.value.firstDayOfWeek,
            dateFormat: this.form.value.dateFormat,
        };
        this.submitting = true;

        this.editUserService
            .editUserData(editUser)
            .pipe(finalize(() => (this.submitting = false)))
            .subscribe(
                next => {
                    this.reloadComponent();
                    this.toast.show(
                        '',
                        this.localiseService.fromKey('successEditHcp'),
                        ToastStyles.Success,
                    );
                },
                error =>
                    this.toast.show(
                        '',
                        this.localiseService.fromKey('failEditHcp'),
                        ToastStyles.Error,
                    ),
            );
    }

    changeProfilePicture() {
        const comp = this.modalService.create<EditProfilePictureComponent>(
            EditProfilePictureComponent,
        );
        comp.newProfilePicture.subscribe(() => {
            this.user = AuthenticationService.getUser();
            this.avatar.refresh();
        });
        comp.open();
    }

    shouldDisableSubmit() {
        return (
            !this.setRole() || this.form.pristine || super.shouldDisableSubmit()
        );
    }

    shouldDisableOther(value: string) {
        if (value === 'existing') {
            this.form.controls['existingRole'].enable();
            this.form.controls['otherRole'].disable();
        } else {
            this.form.controls['existingRole'].disable();
            this.form.controls['otherRole'].enable();
        }
    }

    setRole() {
        return !isEmpty(
            this.form.value.roleRadioSelection === 'existing'
                ? this.form.value.existingRole
                : this.form.value.otherRole,
        );
    }

    private reloadComponent() {
        // Bit of a hack but the only way I can trigger a reload. We need it to update the view after language change
        this.router
            .navigateByUrl('/', {
                skipLocationChange: true,
            })
            .then(() => this.router.navigate(['/user']));
    }

    getdateFormatList() {
        this.hospitalService.fetchHospital().subscribe(data => {
            this.dateformat = data.availableDateFormats;
        });
    }
}
