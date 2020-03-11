import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { LocaliseModule } from '@lib/localise/localise.module';
import { Localise } from '@lib/localise/localise.pipe';
import { C4TRouterModule } from '@lib/router/c4t-router.module';
import { AvatarImgComponent } from '@lib/shared/components/avatars/avatar-img.component';
import { AvatarWithLabelComponent } from '@lib/shared/components/avatars/avatar-with-label.component';
import { BarChartComponent } from '@lib/shared/components/bar-chart/bar-chart.component';
import { CardComponent } from '@lib/shared/components/card/card.component';
import { CircularProgressComponent } from '@lib/shared/components/circular-progress/circular-progress.component';
import { CircularProgressConfig } from '@lib/shared/components/circular-progress/circular-progress.config';
import { CircularProgressEase } from '@lib/shared/components/circular-progress/circular-progress.ease';
import { CircularProgressService } from '@lib/shared/components/circular-progress/circular-progress.service';
import { ConfirmationDialogComponent } from '@lib/shared/components/confirmation-dialog/confirmation-dialog.component';
import { CreateNewMessageComponent } from '@lib/shared/components/create-new-message/create-new-message.component';
import { FancyDateComponent } from '@lib/shared/components/fancy-date/fancy-date.component';
import { HcpOverviewComponent } from '@lib/shared/components/hcp-overview/hcp-overview.component';
import { InputWithPencilComponent } from '@lib/shared/components/input-with-pencil/input-with-pencil.component';
import { ListItemComponent } from '@lib/shared/components/list-item/list-item.component';
import { ForgotPasswordComponent } from '@lib/shared/components/login/forgot-password/forgot-password.component';
import { RequestEmailComponent } from '@lib/shared/components/login/forgot-password/request-email/request-email.component';
import { RequestEmailService } from '@lib/shared/components/login/forgot-password/request-email/request-email.service';
import { LoginComponent } from '@lib/shared/components/login/login.component';
import { HomeRedirectComponent } from './components/home-redirect/home-redirect.component';
import { MasterDetailHeaderComponent } from '@lib/shared/components/master-detail/master-detail-header/master-detail-header.component';
import { MasterDetailWrapperComponent } from '@lib/shared/components/master-detail/master-detail-wrapper.component';
import { MasterRowComponent } from '@lib/shared/components/master-detail/master-row.component';
import { MdtMembersComponent } from '@lib/shared/components/mdt-members/mdt-members.component';
import { ModalPlaceholderComponent } from '@lib/shared/components/modal-placeholder/modal-placeholder.component';
import { ModalWrapperComponent } from '@lib/shared/components/modal-wrapper/modal-wrapper.component';
import { SharedModalComponentsModule } from '@lib/shared/components/modal/modal.module';
import { NavigationBarComponent } from '@lib/shared/components/navigation-bar/navigation-bar.component';
import { NewMessageInfoComponent } from '@lib/shared/components/new-message-info/new-message-info.component';
import { NextApptInfoComponent } from '@lib/shared/components/next-appt-info/next-appt-info.component';
import { PageActionButtonComponent } from '@lib/shared/components/page/action-button/action-button.component';
import { PageHeaderComponent } from '@lib/shared/components/page/before/page-header.component';
import { PageContentComponent } from '@lib/shared/components/page/content/content.component';
import { PageComponent } from '@lib/shared/components/page/page.component';
import { AppPaginationControlsComponent } from '@lib/shared/components/pagination-controls/pagination-controls.component';
import { PasswordRequirementsComponent } from '@lib/shared/components/password-requirements/password-reqs.component';
import { PasswordComponent } from '@lib/shared/components/reset-password/password.component';
import { PasswordService } from '@lib/shared/components/reset-password/password.service';
import { SearchInputComponent } from '@lib/shared/components/search-input/search-input.component';
import { SplashWrapperComponent } from '@lib/shared/components/splash-wrapper.component';
import { TaskListItemComponent } from '@lib/shared/components/task-list-item/task-list-item.component';
import { ToastContainerComponent } from '@lib/shared/components/toast/toast-container.component';
import { ToastService } from '@lib/shared/components/toast/toast.service';
import { DisableControlDirective } from '@lib/shared/directives/disable-input.directive';
import { AgePipe } from '@lib/shared/services/age.pipe';
import { CountdownPipe } from '@lib/shared/services/countdown.pipe';
import { ErrorPipe } from '@lib/shared/services/error.pipe';
import { LocalisedDatePipe } from '@lib/shared/services/localise-date.pipe';
import { SafePipe } from '@lib/shared/services/safe.pipe';
import { FullTextSearchPipe } from '@lib/shared/services/search.pipe';
import { SortOnPipe } from '@lib/shared/services/sort-on.pipe';
import { TruncatePipe } from '@lib/shared/services/truncate.pipe';
import { UserUnitsPipe } from '@lib/shared/services/userUnits.pipe';
import { UnitsUtils } from '@lib/utils/units-utils';
import {
    VirtualScrollComponent,
    VirtualScrollModule,
} from 'angular2-virtual-scroll';
import { NzDatePickerModule } from 'ng-zorro-antd';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import {
    NgxPaginationModule,
    PaginatePipe,
    PaginationControlsComponent,
} from 'ngx-pagination';
// tslint:disable-next-line:max-line-length
import { PasswordConfirmationModalComponent } from '@lib/shared/components/login/forgot-password/password-confirmation-modal/password-confirmation-modal.component';
import {
    AvatarService,
    AVATAR_CACHE,
} from '@lib/shared/components/avatars/avatar.service';
import * as Cache from 'node-cache';
import { EnvService } from '@lib/shared/services/env.service';
import { RestrictProcessingPipe } from './services/restricted-user.pipe';
import { IntegratedAvatarWithLabelComponent } from './components/avatars/integrated-avatar-with-label.component';
import { PopoverComponent } from './components/popover/popover.component';
import { CareModuleSelectionComponent } from './components/modal/care-module-selection/care-module-selection.component';
import { ParticipantSelectorComponent } from './components/participant-selector/participant-selector.component';
import { ParticipantsModule } from '@lib/participants/participants.module';
import { ParticipantMultiSelectorComponent } from './components/participant-selector/participant-multi-selector.component';
import { SurgerySelectionComponent } from './components/modal/surgery-selection/surgery-selection.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { FilterPipe } from './services/items-filter.pipe';
import { DatefunctionsPipe } from './services/datefunctions.pipe';
import { MdtsParticipantMultiSelectorComponent } from './components/participant-selector/mdts-participant-multi-selector.component';
import { CookiePolicyComponent } from './components/cookie-policy/cookie-policy.component';

@NgModule({
    imports: [
        CommonModule,
        LocaliseModule,
        NzDatePickerModule,
        FormsModule,
        BrowserAnimationsModule,
        C4TRouterModule,
        SharedModalComponentsModule,
        VirtualScrollModule,
        ChartsModule,
        NgxPaginationModule,
        ParticipantsModule,
    ],
    exports: [
        SplashWrapperComponent,
        ModalWrapperComponent,
        NavigationBarComponent,
        ToastContainerComponent,
        TruncatePipe,
        FullTextSearchPipe,
        CircularProgressComponent,
        PageComponent,
        PageContentComponent,
        PageActionButtonComponent,
        SharedModalComponentsModule,
        PageHeaderComponent,
        ConfirmationDialogComponent,
        SortOnPipe,
        DisableControlDirective,
        AgePipe,
        SortOnPipe,
        UserUnitsPipe,
        LocalisedDatePipe,
        InputWithPencilComponent,
        VirtualScrollComponent,
        PasswordComponent,
        BarChartComponent,
        SearchInputComponent,
        AppPaginationControlsComponent,
        PaginatePipe,
        PaginationControlsComponent,
        AvatarWithLabelComponent,
        ListItemComponent,
        ModalPlaceholderComponent,
        CountdownPipe,
        ModalPlaceholderComponent,
        MasterDetailWrapperComponent,
        MasterRowComponent,
        CardComponent,
        MasterDetailHeaderComponent,
        FancyDateComponent,
        MdtMembersComponent,
        TaskListItemComponent,
        SafePipe,
        HcpOverviewComponent,
        NextApptInfoComponent,
        NewMessageInfoComponent,
        CreateNewMessageComponent,
        ErrorPipe,
        PasswordRequirementsComponent,
        AvatarImgComponent,
        RestrictProcessingPipe,
        IntegratedAvatarWithLabelComponent,
        PopoverComponent,
        CareModuleSelectionComponent,
        SurgerySelectionComponent,
        ParticipantSelectorComponent,
        ParticipantMultiSelectorComponent,
        MdtsParticipantMultiSelectorComponent,
        ProgressBarComponent,
        FilterPipe,
        DatefunctionsPipe,
        CookiePolicyComponent,
    ],
    declarations: [
        SplashWrapperComponent,
        ModalWrapperComponent,
        NavigationBarComponent,
        ToastContainerComponent,
        TruncatePipe,
        FullTextSearchPipe,
        CircularProgressComponent,
        ToastContainerComponent,
        TruncatePipe,
        FullTextSearchPipe,
        PageComponent,
        PageContentComponent,
        PageActionButtonComponent,
        PageHeaderComponent,
        DisableControlDirective,
        AgePipe,
        ConfirmationDialogComponent,
        SortOnPipe,
        UserUnitsPipe,
        LocalisedDatePipe,
        InputWithPencilComponent,
        LoginComponent,
        HomeRedirectComponent,
        ForgotPasswordComponent,
        RequestEmailComponent,
        PasswordComponent,
        PasswordConfirmationModalComponent,
        BarChartComponent,
        SearchInputComponent,
        AppPaginationControlsComponent,
        AvatarWithLabelComponent,
        ListItemComponent,
        ModalPlaceholderComponent,
        CountdownPipe,
        ModalPlaceholderComponent,
        MasterDetailWrapperComponent,
        MasterRowComponent,
        CardComponent,
        MasterDetailHeaderComponent,
        FancyDateComponent,
        MdtMembersComponent,
        TaskListItemComponent,
        SafePipe,
        HcpOverviewComponent,
        NextApptInfoComponent,
        NewMessageInfoComponent,
        CreateNewMessageComponent,
        ErrorPipe,
        PasswordRequirementsComponent,
        AvatarImgComponent,
        RestrictProcessingPipe,
        IntegratedAvatarWithLabelComponent,
        PopoverComponent,
        CareModuleSelectionComponent,
        SurgerySelectionComponent,
        ParticipantSelectorComponent,
        ParticipantMultiSelectorComponent,
        MdtsParticipantMultiSelectorComponent,
        ProgressBarComponent,
        FilterPipe,
        DatefunctionsPipe,
        CookiePolicyComponent,
    ],
    providers: [
        AuthenticationService,
        NzDatePickerModule,
        ToastService,
        CircularProgressService,
        CircularProgressEase,
        CircularProgressConfig,
        UserUnitsPipe,
        LocalisedDatePipe,
        RestrictProcessingPipe,
        UnitsUtils,
        RequestEmailService,
        PasswordService,
        Localise,
        AvatarService,
        {
            provide: AVATAR_CACHE,
            useFactory: () => new Cache({ stdTTL: 30000 }),
        },
        EnvService,
    ],
    entryComponents: [
        ConfirmationDialogComponent,
        PasswordConfirmationModalComponent,
        IntegratedAvatarWithLabelComponent,
        AvatarWithLabelComponent,
    ],
})
export class SharedModule {}
