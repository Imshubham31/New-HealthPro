import { Injectable } from '@angular/core';
import * as remove from 'lodash/remove';

export enum ToastStyles {
    Normal,
    Success,
    Info,
    Warning,
    Error,
}

export class Toast {
    id = Math.random();
    title: string;
    body: string;
    style: ToastStyles;
    constructor(title: string, body: string, style: ToastStyles) {
        this.title = title;
        this.body = body;
        this.style = style;
    }
}

@Injectable()
export class ToastService {
    toasts: Toast[] = [];

    show(title = '', body = '', style = ToastStyles.Normal, duration = 3000) {
        this.toasts.push(new Toast(title, body, style));
        setTimeout(() => {
            this.toasts.shift();
        }, duration);
    }

    remove(id: number) {
        this.toasts = remove(this.toasts, toast => toast.id !== id);
    }
}
