import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Masks } from '@lib/utils/masks';
import { LocaliseService } from '@lib/localise/localise.service';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import {
    Component,
    forwardRef,
    Input,
    EventEmitter,
    ViewChild,
    Output,
    OnInit,
    OnChanges,
} from '@angular/core';

export enum InputType {
    Height,
    Weight,
    Steps,
}
@Component({
    templateUrl: './input-with-pencil.component.html',
    selector: 'input-with-pencil',
    styleUrls: ['./input-with-pencil.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputWithPencilComponent),
            multi: true,
        },
    ],
})
export class InputWithPencilComponent
    implements ControlValueAccessor, OnInit, OnChanges {
    @Input() value;
    @Input() units = '';
    @Input() type = InputType.Weight;
    @Output() valueChanged = new EventEmitter<string>();
    @ViewChild('inputField', { static: false }) inputField: any;
    @Input() pencildisabled;
    stepGoal;
    actionImgSrc: BehaviorSubject<string> = new BehaviorSubject(
        './../../../assets/accent.svg',
    );
    disabled: BehaviorSubject<boolean> = new BehaviorSubject(true);

    private cachedValue: number;

    constructor(private localise: LocaliseService) {}

    triggerEditMode(value: boolean) {
        value ? this.startEditMode() : this.finishEditMode();
    }

    private finishEditMode() {
        this.actionImgSrc.next('./../../../assets/accent.svg');
        this.disabled.next(true);
        if (this.value !== this.cachedValue) {
            this.valueChanged.emit(this.value);
        }
    }

    private startEditMode() {
        if (!isNaN(this.value)) {
            this.value = Number(this.value).toLocaleString(
                this.localise.getLocale(),
            );
        }
        this.cachedValue = this.value;
        this.actionImgSrc.next('./../../../assets/checkmark.svg');
        this.disabled.next(false);
        setTimeout(() => {
            this.inputField.nativeElement.focus();
            if (this.type === InputType.Steps) {
                Masks.steps(this.inputField.nativeElement);
            } else if (
                AuthenticationService.getUser().units === 'imperial' &&
                this.type === InputType.Height
            ) {
                Masks.feet(this.inputField.nativeElement);
            } else {
                Masks.metric(this.inputField.nativeElement);
            }
        }, 0);
    }

    writeValue(obj: any): void {
        if (obj) {
            this.value = obj;
        }
    }

    registerOnChange(fn: any): void {
        fn();
    }

    registerOnTouched(fn: any): void {
        fn();
    }

    onStepGoalNotEditable() {}
    ngOnChanges() {}
    ngOnInit() {
        this.onStepGoalNotEditable();
    }
}
