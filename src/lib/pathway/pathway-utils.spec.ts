import { ContentStatus } from './pathway.model';
import { PathwayUtils } from './pathway-utils';
import { TestPathways } from '../../test/support/test-pathways';

describe('PathwayUtils', () => {
    describe('getPreviousSubphases', () => {
        it('should return 0 previous subphases', () => {
            const pathway = TestPathways.build();
            const phase = PathwayUtils.getCurrentPhase(pathway);
            expect(phase.id).toBe('1');
            const previousSubphases = PathwayUtils.getPreviousSubphases(
                pathway,
            );
            expect(previousSubphases.length).toBe(0);
        });

        it('should return previous subphases', () => {
            const pathway = TestPathways.build();
            pathway.currentPhaseId = '2';
            const phase = PathwayUtils.getCurrentPhase(pathway);
            expect(phase.id).toBe('2');
            const previousSubphases = PathwayUtils.getPreviousSubphases(
                pathway,
            );
            expect(previousSubphases.length).toBe(1);
        });

        it('should return null if no pathway given', () => {
            expect(PathwayUtils.getCurrentPhase(undefined)).toBeNull();
            expect(PathwayUtils.getCurrentPhase(null)).toBeNull();
        });
    });

    describe('getCurrentPhaseTitle', () => {
        it('should return null if no pathway given', () => {
            expect(PathwayUtils.getCurrentPhaseTitle(undefined)).toBeNull();
            expect(PathwayUtils.getCurrentPhaseTitle(null)).toBeNull();
        });

        it('should return title', () => {
            expect(
                PathwayUtils.getCurrentPhaseTitle(TestPathways.build()),
            ).toBe('Phase Title');
        });
    });

    describe('getCurrentSubPhaseTitle', () => {
        it('should return null if no pathway given', () => {
            expect(PathwayUtils.getCurrentSubPhaseTitle(undefined)).toBeNull();
            expect(PathwayUtils.getCurrentSubPhaseTitle(null)).toBeNull();
        });
        it('should return title', () =>
            expect(
                PathwayUtils.getCurrentSubPhaseTitle(TestPathways.build()),
            ).toBe('Sub Phase'));
    });

    describe('getCurrentSubPhase', () => {
        it('should return null if no pathway given', () => {
            expect(PathwayUtils.getCurrentSubPhase(undefined)).toBeNull();
            expect(PathwayUtils.getCurrentSubPhase(null)).toBeNull();
        });

        it('should return subphase', () => {
            const pathway = TestPathways.build();
            expect(PathwayUtils.getCurrentSubPhase(pathway)).toBe(
                pathway.phases[0].subphases[0],
            );
        });
    });

    describe('getNextPhase', () => {
        it('should return undefined if no pathway given', () =>
            expect(PathwayUtils.getNextPhase(undefined)).toBeNull());

        it('should return phase', () => {
            const pathway = TestPathways.build();
            expect(PathwayUtils.getNextPhase(pathway)).toBe(pathway.phases[1]);
        });
    });

    describe('getNextSubPhase', () => {
        it('should return undefined if no pathway given', () => {
            expect(PathwayUtils.getNextSubPhase(undefined)).toBeNull();
            expect(PathwayUtils.getNextSubPhase(null)).toBeNull();
        });

        it('should return subphase', () => {
            const pathway = TestPathways.build();
            expect(PathwayUtils.getNextSubPhase(pathway)).toBe(
                pathway.phases[1].subphases[0],
            );
        });
    });

    describe('getPhaseOfNextSubphase', () => {
        it('should return phase', () => {
            const pathway = TestPathways.build();
            expect(PathwayUtils.getPhaseOfNextSubphase(pathway)).toBe(
                pathway.phases[1],
            );
        });
    });

    describe('getCurrentEducationalProgress', () => {
        it('should return zero status if no subphase given', () =>
            expect(
                PathwayUtils.getCurrentEducationalProgress(undefined),
            ).toEqual({
                completed: 0,
                total: 0,
            }));

        it('should return progress', () => {
            const pathway = TestPathways.build();
            expect(PathwayUtils.getCurrentEducationalProgress(pathway)).toEqual(
                {
                    completed: 1,
                    total: 2,
                },
            );
        });
    });

    describe('getSubphaseEducationalProgress', () => {
        it('should return progress', () => {
            const pathway = TestPathways.build();
            expect(
                PathwayUtils.getSubphaseEducationalProgress(
                    pathway.phases[1].subphases[0],
                ),
            ).toEqual({
                completed: 1,
                total: 2,
            });
        });
    });

    describe('getCurrentEducationalItems', () => {
        it('should return progress', () => {
            const pathway = TestPathways.build();
            expect(PathwayUtils.getCurrentEducationalItems(pathway)).toEqual(
                pathway.phases[0].subphases[0].items.map(
                    item => item.educationalcontent,
                ),
            );
        });
    });

    describe('getEducationalItemsForSubphase', () => {
        it('should return empty array if no subphase given', () =>
            expect(
                PathwayUtils.getEducationalItemsForSubphase(undefined),
            ).toEqual([]));
        it('should return educational items', () => {
            const pathway = TestPathways.build();
            const currentSubphase = PathwayUtils.getCurrentSubPhase(pathway);
            expect(
                PathwayUtils.getEducationalItemsForSubphase(currentSubphase),
            ).toEqual(
                pathway.phases[0].subphases[0].items.map(
                    item => item.educationalcontent,
                ),
            );
        });
    });

    describe('getEducationalItem', () => {
        it('should return educational item', () => {
            const pathway = TestPathways.build();
            expect(PathwayUtils.getEducationalItem(pathway, '1')).toEqual(
                pathway.phases[0].subphases[0].items
                    .map(item => item.educationalcontent)
                    .find(item => item.id === '1'),
            );
        });
    });

    describe('completeEducationalItem', () => {
        it('should return educational item', () => {
            const pathway = TestPathways.build();
            const newPathway = PathwayUtils.completeEducationalItem(
                pathway,
                '1',
            );
            expect(
                PathwayUtils.getEducationalItem(newPathway, '1').status,
            ).toEqual(ContentStatus.COMPLETE);
        });
    });
});
