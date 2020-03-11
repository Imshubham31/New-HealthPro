export function Unsubscribe(): ClassDecorator {
    return (constructor: any) => {
        const original = constructor.prototype.ngOnDestroy;

        constructor.prototype.ngOnDestroy = function() {
            if (!this.subscriptions) {
                return;
            }

            this.subscriptions.forEach(subscription => {
                if (
                    subscription &&
                    typeof subscription.unsubscribe === 'function'
                ) {
                    subscription.unsubscribe();
                }
            });

            if (original) {
                original.bind(this)();
            }
        };
    };
}
