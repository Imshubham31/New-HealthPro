import { finalize, catchError } from 'rxjs/operators';
import { Component } from '@angular/core';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetsUpForm } from '@lib/shared/services/base-form';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements SetsUpForm {
    loginForm: FormGroup;
    submitting = false;
    formError: string;

    constructor(
        public authService: AuthenticationService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        this.setupForm();
    }

    get redierctMessage() {
        return this.route.snapshot.queryParams['redierctMessage'];
    }

    setupForm() {
        this.loginForm = this.fb.group({
            username: [
                '',
                [
                    Validators.required,
                    Validators.email,
                    Validators.maxLength(100),
                ],
            ],
            password: ['', [Validators.required, Validators.maxLength(100)]],
        });
    }

    login() {
        this.submitting = true;
        this.authService
            .login({
                username: this.loginForm.value.username,
                password: this.loginForm.value.password,
            })
            .pipe(
                catchError(error => (this.formError = error.message)),
                finalize(() => (this.submitting = false)),
            )
            .subscribe();
    }

    forgotPassword() {
        this.router.navigate(['/forgot-password']);
    }

    shouldDisableSubmit() {
        return !this.loginForm.valid || this.submitting;
    }
}
