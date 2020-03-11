import { JnJRestModule } from './jnj-rest.module';
import { TestBed } from '@angular/core/testing';

describe('JnJRestModule', () => {
    let jnJRestModule: JnJRestModule;

    beforeEach(() => {
        jnJRestModule = new JnJRestModule(TestBed);
    });

    it('should create an instance', () => {
        expect(jnJRestModule).toBeTruthy();
    });
});
