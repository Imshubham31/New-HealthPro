import { Hcp } from './../hcp/hcp.model';

export interface MDT {
    id?: string;
    name: string;
    hospitalId: string;
    personal: boolean;
    hcps: Hcp[];
}
