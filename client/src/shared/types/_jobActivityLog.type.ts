import { IJobActivityLogResponse } from "../interfaces";

export type TJobActivityLog = Omit<IJobActivityLogResponse, 'jobId' | 'modifiedById'>