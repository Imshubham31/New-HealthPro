import { Surgery } from './surgery.model';
import { User } from '@lib/authentication/user.model';
import { MDT } from '../mdt/mdt.model';

export class Patient extends User {
    height?: number;
    pathwayId: any;
    careModuleId: string;
    surgery: Surgery;
    dob?: string;
    mdts: MDT[];
}

export class MdtsHcps {
    personalMdt?: { hcps: string[] };
    sharedMdtIds?: string[];

    static fromMDts(mdts: MDT[]): MdtsHcps {
        if (!mdts || mdts.length === 0) {
            return null;
        }
        const res = new MdtsHcps();
        res.sharedMdtIds = mdts.filter(mdt => !mdt.personal).map(mdt => mdt.id);
        const hcps = mdts
            .filter(mdt => mdt.personal)
            .reduce(
                (prev: string[], mdt: MDT) =>
                    prev.concat(mdt.hcps.map(hcp => hcp.backendId)),
                [],
            );
        res.personalMdt = hcps.length > 0 ? { hcps } : null;
        return res;
    }
}
