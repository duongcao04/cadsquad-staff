import { ProjectCenterTabEnum } from '@/shared/enums'
import { Store } from '@tanstack/react-store'

export const projectCenterStore = new Store({
    tab: ProjectCenterTabEnum.PRIORITY,
    limit: 10,
    page: 1,
    sort: '',
    search: '',
    isHideFinishItems: false,
})
