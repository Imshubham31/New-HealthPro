import { ActivatedRoute } from '@angular/router';
import { LocalisedDatePipe } from '@lib/shared/services/localise-date.pipe';
import { MessagesCoordinatorService } from './../messages.coordinator.service';
import { AllMessagesContainerComponent } from './all-messages-container.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { LocaliseModule } from '@lib/localise/localise.module';
import { CommonModule } from '@angular/common';
import { VirtualScrollComponent } from 'angular2-virtual-scroll';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Subject, of } from 'rxjs';

let component: AllMessagesContainerComponent;
let fixture: ComponentFixture<AllMessagesContainerComponent>;

@Component({
    selector: 'master-detail-header',
    template: '<p>master-detail-header</p>',
})
class MockAppPaginationControlsComponent {
    @Input() title: any;
    @Input() buttonTitle: any;
}

@Component({
    selector: 'app-search-input',
    template: '<p>app-search-input</p>',
})
class MockSearchInputComponent {
    @Input() dataSource: any;
    @Input() keys: any;
    @Input() placeholder: any;
}

xdescribe('All Messages Container Component', () => {
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule, LocaliseModule],
            declarations: [
                AllMessagesContainerComponent,
                VirtualScrollComponent,
                MockAppPaginationControlsComponent,
                MockSearchInputComponent,
            ],
            providers: [
                {
                    provide: MessagesCoordinatorService,
                    useValue: {
                        initialiseState: () => of(),
                        chats: new Subject(),
                    },
                },
                {
                    provide: LocalisedDatePipe,
                    useValue: {
                        transform: (time, format) => ({
                            time,
                            format,
                        }),
                    },
                },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        parent: {
                            queryParams: of({}),
                        },
                    },
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });

        fixture = TestBed.createComponent(AllMessagesContainerComponent);
        component = fixture.componentInstance;
        (component as any).router = {
            navigate: () => {},
        };
        fixture.detectChanges();
    });
    // it('should format date correctly', () => {
    //     expect(component.formatDate(0).format).toBe('d MMM y');
    //     expect(component.formatDate(new Date().getTime()).format).toBe('HH:mm');
    // });
});
