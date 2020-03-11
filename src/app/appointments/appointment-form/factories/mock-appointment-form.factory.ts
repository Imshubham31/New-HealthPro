import { AppointmentFormFactory } from './appointment-form.factory';

export class MockAppointmentFormFactory {
    static buildProvider() {
        return {
            provide: AppointmentFormFactory,
            useValue: {
                makeCreateForm: () => ({ open: () => {} }),
                makeUpdateForm: () => ({
                    open: () => {},
                }),
            },
        };
    }
}
