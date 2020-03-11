export class PatientRegistration {
    patient: Patient;
    careModule: Caremodule;
    isChecked: boolean;
}
export class Patient {
    id: string;
    dob: string;
    fullname: string;
    email: string;
    phoneNumber?: string;
    pathwayId: number;
    createdAt: string;
}
export class Caremodule {
    id: string;
    title: string;
}
