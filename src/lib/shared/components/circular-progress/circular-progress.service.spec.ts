import { TestBed } from '@angular/core/testing';
import { CircularProgressService } from './circular-progress.service';

describe('Circular progress service', () => {
    let circularProgressService: CircularProgressService;

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            declarations: [],
            providers: [CircularProgressService],
        });
        circularProgressService = TestBed.get(CircularProgressService);
    });

    it('Should calculate the arc correctly', () => {
        const arc = circularProgressService.getArc(100, 150, 30, 40);
        expect(arc).toBe(
            'M 14.019255339776954 55.00003022997926 A 30 30 0 1 0 40 10',
        );
    });
});
