export interface MedicalRecord {
    id?: string;
    type: string;
    height: HeightRecord;
    createdDateTime: Date;
}

export interface HeightRecord {
    unit: string;
    value: number;
}
