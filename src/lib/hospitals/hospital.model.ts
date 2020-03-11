export enum HospitalType {
    Integrated = 'integrated',
    NonIntegrated = 'non-integrated',
}
export interface Hospital {
    id?: string;
    name?: string;
    integrated?: boolean;
    autoPatientEnrollment?: boolean;
    showExportMyData?: boolean;
    showRightToBeForgotten?: boolean;
    showRestrictToProcessData?: boolean;
    logos?: {
        web?: string;
    };
    availableDateFormats?: DateFormat[];
}

export interface DateFormat {
    format: string;
}
