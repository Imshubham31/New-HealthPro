import { Observable } from 'rxjs';

export const spyOnSubscription = (
    object: any,
    method: string,
    returnValue: Observable<any>,
) => {
    let subscribe;
    let observable;
    observable = spyOn(object, method).and.returnValue(returnValue);
    if (object[method].constructor.name === Function.name) {
        subscribe = spyOn(object[method](), 'subscribe');
    } else {
        subscribe = spyOn(object[method], 'subscribe');
    }
    return {
        observable,
        subscribe,
        reset: function() {
            this.observable.calls.reset();
            this.subscribe.calls.reset();
        },
    };
};
