import { ActivityTracker } from '@lib/utils/activity-tracker';

describe('ActivityTracker', () => {
    let activityTracker: ActivityTracker;
    beforeEach(() => {
        activityTracker = new ActivityTracker(10, 1);
    });

    it('should call action after activityTracker time', done =>
        activityTracker.start(() => done()));

    buildEvents().forEach(event =>
        it(`should reset timer after interaction ${event}`, () => {
            activityTracker.start(() => {});
            document.dispatchEvent(event);
            expect(activityTracker.idleTime).toBeLessThanOrEqual(1);
        }),
    );

    function buildEvents() {
        return [
            new UIEvent('click'),
            new UIEvent('mousemove'),
            new UIEvent('mouseenter'),
            new UIEvent('keydown'),
            new UIEvent('scroll'),
            new UIEvent('touchstart'),
        ];
    }
});
