import { MdtMembers } from '../mdt-members.model';
import { Surgery } from '../surgery.model';
import { CareModuleModel } from '../add-patient/care-module/care-module.model';
import { Patient } from '../patient.model';
export class PatientDetailsModel {
    patient: Patient;
    careModule: CareModuleModel;
    surgery: Surgery;
    mdtMembers: MdtMembers[];
}
