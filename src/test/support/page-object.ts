import { ComponentFixture } from '../../../node_modules/@angular/core/testing';

export abstract class PageObject<T> {
    fixture: ComponentFixture<T>;
    component: T;

    constructor(fixture: ComponentFixture<T>) {
        this.fixture = fixture;
        this.component = fixture.componentInstance;
    }
}
