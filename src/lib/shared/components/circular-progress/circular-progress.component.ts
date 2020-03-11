import {
    Component,
    Input,
    Output,
    OnChanges,
    NgZone,
    EventEmitter,
    ViewChild,
    Renderer,
} from '@angular/core';
import { CircularProgressService } from './circular-progress.service';
import { CircularProgressConfig } from './circular-progress.config';
import { CircularProgressEase } from './circular-progress.ease';
import * as round from 'lodash/round';

@Component({
    selector: 'circular-progress',
    template: `
        <svg xmlns="http://www.w3.org/2000/svg" [attr.viewBox]="_viewBox">
            <circle
                fill="none"
                [attr.cx]="radius"
                [attr.cy]="radius"
                [attr.r]="radius - stroke / 2"
                [style.stroke]="resolveColor(background)"
                [style.stroke-width]="stroke"
            />
            <path
                #path
                fill="none"
                [style.stroke-width]="stroke"
                [style.stroke]="resolveColor(color)"
                [style.stroke-linecap]="rounded ? 'round' : ''"
                [attr.transform]="getPathTransform()"
            />
        </svg>
    `,
    // tslint:disable-next-line:no-host-metadata-property
    host: {
        role: 'progressbar',
        '[attr.aria-valuemin]': 'current',
        '[attr.aria-valuemax]': 'max',
        '[style.width]': `responsive ? '' : _diameter + 'px'`,
        '[style.height]': '_elementHeight',
        '[style.padding-bottom]': '_paddingBottom',
        '[class.responsive]': 'responsive',
    },
    styles: [
        `
            :host {
                display: block;
                position: relative;
                overflow: hidden;
            }
        `,
        `
            :host.responsive {
                width: 100%;
                padding-bottom: 100%;
            }
        `,
        `
            :host.responsive > svg {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
            }
        `,
    ],
})
export class CircularProgressComponent implements OnChanges {
    @ViewChild('path', { static: true }) _path;
    @Input() current: number;
    @Input() max: number;
    @Input() radius: number = this._defaults.get('radius');
    @Input() animation: string = this._defaults.get('animation');
    @Input() animationDelay: number = this._defaults.get('animationDelay');
    @Input() duration: number = this._defaults.get('duration');
    @Input() stroke: number = this._defaults.get('stroke');
    @Input() color: string = this._defaults.get('color');
    @Input() background: string = this._defaults.get('background');
    @Input() responsive: boolean = this._defaults.get('responsive');
    @Input() clockwise: boolean = this._defaults.get('clockwise');
    @Input() semicircle: boolean = this._defaults.get('semicircle');
    @Input() rounded: boolean = this._defaults.get('rounded');
    @Output() onRender: EventEmitter<number> = new EventEmitter();
    private _lastAnimationId = 0;

    constructor(
        private _service: CircularProgressService,
        private _easing: CircularProgressEase,
        private _defaults: CircularProgressConfig,
        private _ngZone: NgZone,
        private _renderer: Renderer,
    ) {}

    /** Animates a change in the current value. */
    private _animateChange(from: number, to: number): void {
        if (typeof from !== 'number') {
            from = 0;
        }

        to = this._clamp(to);
        from = this._clamp(from);

        const self = this;
        const changeInValue = to - from;
        const duration = self.duration;

        // Avoid firing change detection for each of the animation frames.
        self._ngZone.runOutsideAngular(() => {
            const start = () => {
                const startTime = self._service.getTimestamp();
                const id = ++self._lastAnimationId;

                requestAnimationFrame(function animation() {
                    const currentTime = Math.min(
                        self._service.getTimestamp() - startTime,
                        duration,
                    );
                    const value = self._easing[self.animation](
                        currentTime,
                        from,
                        changeInValue,
                        duration,
                    );

                    self._setPath(value);
                    self.onRender.emit(value);

                    if (
                        id === self._lastAnimationId &&
                        currentTime < duration
                    ) {
                        requestAnimationFrame(animation);
                    }
                });
            };

            if (this.animationDelay > 0) {
                setTimeout(start, this.animationDelay);
            } else {
                start();
            }
        });
    }

    /** Sets the path dimensions. */
    private _setPath(value: number): void {
        if (this._path) {
            this._renderer.setElementAttribute(
                this._path.nativeElement,
                'd',
                this._service.getArc(
                    value,
                    this.max,
                    this.radius - this.stroke / 2,
                    this.radius,
                    this.semicircle,
                ),
            );
        }
    }

    /** Clamps a value between the maximum and 0. */
    private _clamp(value: number): number {
        return Math.max(0, Math.min(value || 0, this.max));
    }

    /** Determines the SVG transforms for the <path> node. */
    getPathTransform(): string {
        const diameter = this._diameter;

        if (this.semicircle) {
            return this.clockwise
                ? `translate(0, ${diameter}) rotate(-90)`
                : `translate(${diameter +
                      ',' +
                      diameter}) rotate(90) scale(-1, 1)`;
        }
        if (!this.clockwise) {
            return `scale(-1, 1) translate(-${diameter} 0)`;
        }
        return null;
    }

    resolveColor(color: string): string {
        const percent = round(this.current / this.max, 2);
        const colors = {
            green: '#73CD1F',
            amber: '#FFC200',
            red: '#F7211B',
        };
        if (percent > 0.66) {
            this.color = colors.green;
        } else if (percent <= 0.66 && percent > 0.33) {
            this.color = colors.amber;
        } else {
            this.color = colors.red;
        }
        return color;
    }

    /** Change detection callback. */
    ngOnChanges(changes): void {
        if (changes.current) {
            this._animateChange(
                changes.current.previousValue,
                changes.current.currentValue,
            );
        } else {
            this._setPath(this.current);
        }
    }

    /** Diameter of the circle. */
    get _diameter(): number {
        return this.radius * 2;
    }

    /** The CSS height of the wrapper element. */
    get _elementHeight(): string {
        if (!this.responsive) {
            return (this.semicircle ? this.radius : this._diameter) + 'px';
        }
        return null;
    }

    /** Viewbox for the SVG element. */
    get _viewBox(): string {
        const diameter = this._diameter;
        return `0 0 ${diameter} ${this.semicircle ? this.radius : diameter}`;
    }

    /** Bottom padding for the wrapper element. */
    get _paddingBottom(): string {
        if (this.responsive) {
            return this.semicircle ? '50%' : '100%';
        }
        return null;
    }
}
