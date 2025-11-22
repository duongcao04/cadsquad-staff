import { IConfigResponse } from "../interfaces";

export type TUserConfig = Omit<IConfigResponse, 'userId'>