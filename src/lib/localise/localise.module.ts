import { NgModule } from '@angular/core';
import { Localise } from '@lib/localise/localise.pipe';
import { LocaliseService } from '@lib/localise/localise.service';
import { LANGUAGE_PROVIDERS } from './languages';

@NgModule({
    imports: [],
    exports: [Localise],
    declarations: [Localise],
    providers: [LANGUAGE_PROVIDERS, LocaliseService],
})
export class LocaliseModule {}
