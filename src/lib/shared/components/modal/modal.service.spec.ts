import { ModalService, ModalControls } from './modal.service';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ModalWrapperComponent } from '../modal-wrapper/modal-wrapper.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ModalPlaceholderComponent } from '@lib/shared/components/modal-placeholder/modal-placeholder.component';

@Component({
    template: '<div id="mockComponent"></div>',
})
class MockComponent implements ModalControls {
    modal = new ModalWrapperComponent();
    open() {}
    close(_result?: any) {}
}

describe('ModalService', () => {
    let service: ModalService;
    let fixture: ComponentFixture<ModalPlaceholderComponent>;

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            providers: [ModalService],
            declarations: [MockComponent, ModalPlaceholderComponent],
        });
        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [MockComponent],
            },
        });

        service = TestBed.get(ModalService);
        fixture = TestBed.createComponent(ModalPlaceholderComponent);
        const vRef = fixture.componentInstance.modalComponentContainer;
        service.registerViewContainerRef(vRef);
    });

    describe('create#', () => {
        it('should create a modal', () => {
            expect(service.create<MockComponent>(MockComponent)).toBeDefined();
        });
    });
});
