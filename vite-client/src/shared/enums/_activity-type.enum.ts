export const ActivityTypeEnum = {
    CreateJob: 'CreateJob',
    ChangeStatus: 'ChangeStatus',
    AssignMember: 'AssignMember',
    UnassignMember: 'UnassignMember',
    ChangePaymentChannel: 'ChangePaymentChannel',
    UpdateInformation: 'UpdateInformation',
    DeleteJob: 'DeleteJob',
    MarkPaid: 'MarkPaid',
    DeliverJob: 'DeliverJob',
    RescheduleJob: 'RescheduleJob',
} as const
export type ActivityTypeEnum =
    (typeof ActivityTypeEnum)[keyof typeof ActivityTypeEnum]
