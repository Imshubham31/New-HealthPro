import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MdtsRoutingModule } from './mdts-routing.module';
import { MdtsOverviewComponent } from './mdts-overview/mdts-overview.component';
import { MdtsCardRowComponent } from './mdts-card-row/mdts-card-row.component';
import { SharedModule } from '@lib/shared/shared.module';
import { MdtsService } from './mdts.service';
import { MdtsRestService } from './mdts-rest.service';
import { MdtsFormComponent } from './mdts-form/mdts-form.component';
import { LocaliseModule } from '@lib/localise/localise.module';
import { LocaliseService } from '@lib/localise/localise.service';

@NgModule({
    declarations: [
        MdtsOverviewComponent,
        MdtsCardRowComponent,
        MdtsFormComponent,
    ],
    imports: [
        CommonModule,
        MdtsRoutingModule,
        SharedModule,
        FormsModule,
        LocaliseModule,
    ],
    providers: [MdtsService, MdtsRestService, LocaliseService],
    entryComponents: [MdtsFormComponent],
})
export class MdtsModule {}
