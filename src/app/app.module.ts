import { SearchModule } from './../lib/search/search.module';
import {
    ACTIVITY_TRACKER_TOKEN,
    ActivityTracker,
} from './../lib/utils/activity-tracker';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AuthenticationModule } from '@lib/authentication/authentication.module';
import { AuthorisationInterceptor } from '@lib/authentication/token-refresh/authorisation-interceptor';
import { HospitalModule } from '@lib/hospitals/hospital.module';
import { LocaliseInterceptor } from '@lib/localise/localise-interceptor';
import { LocaliseModule } from '@lib/localise/localise.module';
import { registerRequiredLocales } from '@lib/localise/languages';
import { OnboardingModule } from '@lib/onboarding/onboarding.module';
import { C4TRouterModule, defaultRoute } from '@lib/router/c4t-router.module';
import { SharedModule } from '@lib/shared/shared.module';
import { JnJRestModule } from 'lib/jnj-rest/jnj-rest.module';

import { environment } from '../environments/environment';
import { AppCoordinator } from '@lib/app-coordinator/app-coordinator.service';
import { AppComponent } from './app.component';
import { HcpAppointmentsModule } from './appointments/appointments.module';
import { HcpNotesModule } from './hcp-notes/hcp-notes.module';
import { HcpModule } from './hcp/hcp.module';
import { MdtModule } from './mdt/mdt.module';
import { PatientsModule } from './patients/patients.module';
import { SettingsModule } from './settings/settings.module';
import { UserModule } from '@lib/user/user.module';
import { HcpGoalsModule } from './goals/goals.module';
import { HcpMessagesModule } from './messages/messages.module';
import { MfaModule } from '../lib/mfa/mfa.module';
import { TemplateModule } from './template/template.module';
import { MdtsModule } from './mdts/mdts.module';
import { RegistrationModule } from './registration/registration.module';

registerRequiredLocales();
@NgModule({
    declarations: [AppComponent],
    imports: [
        C4TRouterModule,
        // Nemanja Tosic: the only way i could think of to get the catch all
        // route AFTER all other routes
        RouterModule.forRoot([{ path: '**', redirectTo: defaultRoute }]),
        BrowserModule,
        ServiceWorkerModule.register('/ngsw-worker.js', {
            enabled: environment.serviceWorkerEnabled,
        }),
        HttpClientModule,
        SharedModule,
        LocaliseModule,
        HcpAppointmentsModule,
        AuthenticationModule,
        OnboardingModule,
        MfaModule,
        PatientsModule,
        HcpMessagesModule,
        HcpModule,
        MdtModule,
        UserModule,
        HcpModule,
        HospitalModule,
        SettingsModule,
        HcpGoalsModule,
        HcpNotesModule,
        SearchModule,
        TemplateModule,
        MdtsModule,
        RegistrationModule,
        JnJRestModule.init({ baseUrl: environment.baseUrl }),
    ],
    providers: [
        AppCoordinator,
        {
            provide: ACTIVITY_TRACKER_TOKEN,
            useValue: new ActivityTracker(),
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthorisationInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LocaliseInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
