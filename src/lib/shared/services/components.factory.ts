import { Injectable, Type } from '@angular/core';

interface Parts {
    [index: string]: any;
}

@Injectable()
export class ComponentsFactory {
    private parts: Parts;

    make(type: string): Type<any> {
        return this.parts[type];
    }

    addPart(part: Parts) {
        this.parts = { ...this.parts, ...part };
    }
}
