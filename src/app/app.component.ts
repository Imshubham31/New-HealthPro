import { Component, HostListener, OnInit, Inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
    AppCoordinator,
    LoadingOverlay,
} from '@lib/app-coordinator/app-coordinator.service';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { LocaliseService } from '@lib/localise/localise.service';
import { filter } from 'rxjs/operators';
import { EnvService } from '@lib/shared/services/env.service';
import {
    ActivityTracker,
    ACTIVITY_TRACKER_TOKEN,
} from '@lib/utils/activity-tracker';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss', './app.localised.scss'],
})
export class AppComponent implements OnInit {
    componentData = null;
    showNavBar = false;
    showLoadingOverlay = false;
    loadingState: LoadingOverlay = {
        loading: false,
    };

    constructor(
        private appCoordinator: AppCoordinator,
        public translate: LocaliseService,
        private router: Router,
        private envService: EnvService,
        @Inject(ACTIVITY_TRACKER_TOKEN)
        private activityTracker: ActivityTracker,
    ) {
        // this.router.events.subscribe(event => {
        //     if (event instanceof NavigationEnd) {
        //         (<any>window).ga('set', 'page', event.urlAfterRedirects);
        //         (<any>window).ga('send', 'pageview');
        //     }
        // });
    }

    @HostListener('window:beforeunload')
    logout() {
        if (this.envService.get().canRefresh) {
            return;
        }
        AuthenticationService.deleteAuthToken();
        AuthenticationService.deleteUser();
    }

    ngOnInit(): void {
        if (AuthenticationService.getUser()) {
            this.trackActivity();
        } else {
            this.appCoordinator.onLogin().subscribe(() => {
                this.trackActivity();
            });
        }

        this.translate.use(AuthenticationService.getUserLanguage());
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                AppCoordinator.loadingOverlay.next({
                    loading: false,
                });
                const url = event.urlAfterRedirects || event.url;
                this.showNavBar =
                    !['/login', '/onboarding', '/forgot-password', '/mfa'].some(
                        endpoint => url.startsWith(endpoint),
                    ) && AuthenticationService.isLoggedIn;
            });

        // Need to do this in a setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError error
        AppCoordinator.loadingOverlay.subscribe(loadingState =>
            setTimeout(() => (this.loadingState = loadingState)),
        );
    }

    private trackActivity() {
        this.activityTracker.start(() =>
            AuthenticationService.logout('userInactivity'),
        );
    }
}
