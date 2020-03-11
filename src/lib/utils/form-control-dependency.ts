import { FormGroup } from '@angular/forms';

// TODO: explain
export function setUpFormDependencies(
    form: FormGroup,
    dependencies: Array<Array<string>>,
    initialValue: any = form.getRawValue(),
) {
    dependencies.forEach(([controlName, dependency]) => {
        const control = form.get(controlName);

        check(control, control.value, controlName);
        form.get(dependency).valueChanges.forEach(value => {
            check(control, value, controlName);
        });
    });

    function check(control, value, controlName) {
        if (value) {
            control.enable();
        } else {
            control.setValue(initialValue[controlName]);
            control.disable();
        }
    }
}
