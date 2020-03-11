export const ACTIVITY_TRACKER_TOKEN = 'ActivityTrackerToken';
export class ActivityTracker {
    private complete?: () => void;
    private events = [
        'click',
        'mousemove',
        'mouseenter',
        'keydown',
        'scroll',
        'touchstart',
    ];

    private interval;
    private startTime = 0;
    get idleTime() {
        return Date.now() - this.startTime;
    }

    private listener = () => {
        clearInterval(this.interval);
        this.startTimer();
        // tslint:disable-next-line:semicolon
    };

    constructor(
        private readonly timeout = 15 * 60 * 1000,
        private readonly resolution = 1000,
    ) {}

    start(callback: () => void) {
        if (this.interval) {
            return;
        }
        this.complete = callback;
        this.trackEvents();
        this.startTimer();
    }

    private end() {
        if (typeof this.complete === 'function') {
            this.complete();
        }
        clearInterval(this.interval);
        this.endTrackEvents();
    }

    private trackEvents() {
        this.events.forEach(event =>
            document.addEventListener(event, this.listener, true),
        );
    }

    private endTrackEvents() {
        this.events.forEach(event =>
            document.removeEventListener(event, this.listener, true),
        );
    }

    private tick() {
        if (this.idleTime >= this.timeout) {
            this.end();
        }
    }

    private startTimer() {
        this.startTime = Date.now();
        this.interval = setInterval(() => this.tick(), this.resolution);
    }
}
