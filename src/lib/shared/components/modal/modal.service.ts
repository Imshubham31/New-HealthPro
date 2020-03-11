import {
    ComponentFactoryResolver,
    Injectable,
    ViewContainerRef,
    Type,
} from '@angular/core';

import { ModalWrapperComponent } from '../modal-wrapper/modal-wrapper.component';

export interface ModalControls {
    modal: ModalWrapperComponent;
    open(): void;
    close(result?: any): void;
}

@Injectable()
export class ModalService {
    private vcRef: ViewContainerRef;
    constructor(private resolver: ComponentFactoryResolver) {}

    registerViewContainerRef(vcRef: ViewContainerRef): void {
        this.vcRef = vcRef;
    }

    create<T extends ModalControls>(
        component: Type<T>,
        inputParameters?: object,
    ) {
        const factory = this.resolver.resolveComponentFactory<T>(component);
        const componentRef = this.vcRef.createComponent<T>(factory);
        Object.assign(componentRef.instance, inputParameters);
        const createdView = this.vcRef.insert(componentRef.hostView);
        componentRef.instance.modal.callDestroy = () => {
            const ix = this.vcRef.indexOf(createdView);
            if (ix >= 0) {
                this.vcRef.remove(ix);
            }
            const ix2 = this.vcRef.indexOf(componentRef.hostView);
            if (ix2 >= 0) {
                this.vcRef.remove(ix2);
            }
        };
        return componentRef.instance;
    }
}
