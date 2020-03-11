import { VirtualScroll } from './virtual-scroll';

describe('VirtualScroll', () => {
    const MockClass = class extends VirtualScroll {};
    describe('#scrollHeight()', () => {
        it('should return 0px if element is undefined', () => {
            expect(new MockClass().scrollHeight()).toBe('0px');
        });

        it('should calculate scroll height', () => {
            const mockClass = new MockClass();
            const scrollerPos = 10;
            mockClass.virtualScroll = {
                element: {
                    nativeElement: {
                        getBoundingClientRect: () => {
                            return { top: scrollerPos };
                        },
                    },
                },
            };

            expect(mockClass.scrollHeight()).toBe(
                `${window.innerHeight - scrollerPos}px`,
            );
        });
    });

    describe('refresheight', () => {
        it('update the height', () => {
            const mockClass = new MockClass();
            spyOn(mockClass, 'scrollHeight').and.returnValue('20px');
            mockClass.refreshHeight();
            expect(mockClass.height).toBe('20px');
        });
    });
});
