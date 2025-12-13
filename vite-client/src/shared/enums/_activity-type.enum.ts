export const ActivityTypeEnum = {
    CreateJob: 'CreateJob',
    ChangeStatus: 'ChangeStatus',
    AssignMember: 'AssignMember',
    UnassignMember: 'UnassignMember',
    ChangePaymentChannel: 'ChangePaymentChannel',
    UpdateInformation: 'UpdateInformation',
    DeleteJob: 'DeleteJob',
} as const
export type ActivityTypeEnum =
    (typeof ActivityTypeEnum)[keyof typeof ActivityTypeEnum]
