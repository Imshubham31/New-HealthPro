import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LocaliseService } from '@lib/localise/localise.service';
import { SharedModule } from '@lib/shared/shared.module';
import { ParticipantsService } from '@lib/participants/participants.service';
import { of } from 'rxjs';
import { MdtsParticipantMultiSelectorComponent } from './mdts-participant-multi-selector.component';
import { TagModel } from '../modal/multilist-tag-input/multi-list-tag-input.component';
import { TestMDTs } from 'test/support/test-mdts';
import { MDTs } from 'app/mdts/mdts.model';
import { MdtsHcps } from 'app/patients/patient.model';

xdescribe('MdtsParticipantMultiSelectorComponent', () => {
    let fixture: ComponentFixture<MdtsParticipantMultiSelectorComponent>;
    let component: MdtsParticipantMultiSelectorComponent;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [SharedModule],
            providers: [
                {
                    provide: ParticipantsService,
                    useValue: {
                        filteredStore: () => of(),
                        fetch: () => {},
                    },
                },
                {
                    provide: LocaliseService,
                    useValue: {
                        fromParams: () => {},
                    },
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(
            MdtsParticipantMultiSelectorComponent,
        );
        component = fixture.componentInstance;
    });
    describe('handleValueChanged', () => {
        it('for empty array of values', () => {
            // setup
            spyOn(component.valueChanged, 'emit');
            const values: TagModel[] = [];

            // act
            component.handleValueChanged(values);

            // test
            expect(component.valueChanged.emit).toHaveBeenCalledWith({
                sharedMdtIds: [],
            });
        });
        it('with mdt value added as sharedMdtId', () => {
            // setup
            spyOn(component.valueChanged, 'emit');
            const values: TagModel[] = [
                {
                    id: 'mdt-1',
                    detail: '',
                    name: 'mdt',
                    type: 'MDT',
                },
            ];

            // act
            component.handleValueChanged(values);

            // test
            expect(component.valueChanged.emit).toHaveBeenCalledWith({
                sharedMdtIds: ['mdt-1'],
            });
        });
        it('with mdt value added as incividual hcp', () => {
            // setup
            spyOn(component.valueChanged, 'emit');
            const values: TagModel[] = [
                {
                    id: 'hcp-1',
                    detail: '',
                    name: 'hcp test',
                    type: 'HCP',
                },
            ];

            // act
            component.handleValueChanged(values);

            // test
            expect(component.valueChanged.emit).toHaveBeenCalledWith({
                sharedMdtIds: [],
                personalMdt: { hcps: ['hcp-1'] },
            });
        });
    });
    describe('valueTransformer', () => {
        it('for empty value transform to empty array', () => {
            // setup
            const input = null;

            // act
            const result = component.valueTransformer(input);

            // test
            expect(result).toBe([]);
        });
        it('for array of MDTs', () => {
            // setup
            const input: MDTs[] = [
                TestMDTs.buildMdts({ id: 'mdt-1', personal: false }),
            ];

            // act
            const result = component.valueTransformer(input);

            // test
            expect(result.length).toBe(1);
            expect(result[0].id).toBe('mdt-1');
        });
        it('for MDTsHcps', () => {
            // setup
            const input: MdtsHcps = {
                sharedMdtIds: ['mdt-1'],
            };

            // act
            const result = component.valueTransformer(input);

            // test
            expect(result.length).toBe(1);
            expect(result[0].id).toBe('mdt-1');
        });
    });
});
