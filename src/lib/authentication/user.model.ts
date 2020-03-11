export interface Restrictable {
    firstName?: string;
    lastName?: string;
    isRestricted?: boolean;
    role?: string;
    displayName?: string;
    name?: string;
}
export class User implements Restrictable {
    backendId?: string;
    idmsId?: number;
    fullName: string;
    firstName?: string;
    lastName: string;
    email: string;
    nickname: string;
    phoneNumber: string;
    hospitalId: string;
    profilePictureUri?: string;
    language?: string;
    dateFormat: string;
    firstDayOfWeek: string;
    role?: string;
    units?: string;
    gender?: string;
    optOut?: boolean;
    optOutDatetime?: string;
    hasCompletedOnboarding: boolean;
    isActive?: boolean;
    isRestrictedRequested?: boolean;
    isRestricted?: boolean;
    onboardingState: {
        hasUpdatedPassword: boolean;
        hasUpdatedProfilePicture: boolean;
        hasConsented: boolean;
        consentDate?: string;
        hasFullyConsented?: boolean;
    };
    documentsAccepted: UserConsent[];
    integrated?: {
        mrn: string;
    };
}

export interface UserConsent {
    id?: number;
    key: string;
    revision: string;
    documentId: string;
    dateAccepted?: string;
}
