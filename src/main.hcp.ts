import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { AppState } from './app.state';

if (environment.production) {
    enableProdMode();
}

AppState.clientId = environment.hcpClientId;
AppState.name = 'hcpPortal';

platformBrowserDynamic().bootstrapModule(AppModule);
