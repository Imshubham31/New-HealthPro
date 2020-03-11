import * as InputMask from 'inputmask';
export class Masks {
    static stepsRegEx = '[\\d|\\u0660-\\u0669]{1,5}';
    static metricRegEx =
        '[\\d|\\u0660-\\u0669]{1,3}[?\\.|\\u066B][?\\d|\\u0660-\\u0669]{2}';
    static feetRegEx =
        '[\\d|\\u0660-\\u0669]{1}\'[\\d|\\u0660-\\u0669]{1,2}\\"';
    static phoneRegEx =
        '[\\+|\\*||\\#|\\d|\u0660-\u0669]{1}[\\d|\u0660-\u0669]{1,29}';
    static mfaPhoneRegEx = '^\\+[1-9]\\d{6,14}$';

    static phone(element: any) {
        return InputMask({
            regex: this.phoneRegEx,
            greedy: false,
            clearIncomplete: true,
        }).mask(element);
    }

    static mfaPhone(element: any) {
        return InputMask({
            regex: this.mfaPhoneRegEx,
            greedy: false,
            clearIncomplete: true,
        }).mask(element);
    }

    static time(element: any) {
        return InputMask({
            mask: 'h:s',
            placeholder: 'hh:mm',
            alias: 'datetime',
            hourFormat: '12',
            clearIncomplete: true,
        }).mask(element);
    }

    static metric(element: any) {
        return InputMask({
            regex: this.metricRegEx,
            placeholder: '',
        }).mask(element);
    }

    static feet(element: any) {
        return InputMask({
            regex: this.feetRegEx,
            placeholder: '0',
            clearIncomplete: true,
        }).mask(element);
    }

    static steps(element: any) {
        return InputMask({
            regex: this.stepsRegEx,
            placeholder: '',
        }).mask(element);
    }
}
