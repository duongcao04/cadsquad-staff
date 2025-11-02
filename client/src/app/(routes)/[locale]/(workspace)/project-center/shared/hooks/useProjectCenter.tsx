import { useRouter } from '@/i18n/navigation'
import { JobQueryInput } from '@/lib/validationSchemas'
import { ProjectCenterTabEnum } from '@/shared/enums'
import { useStore } from '@tanstack/react-store'
import { projectCenterStore } from '../stores'

export function useProjectCenter() {
    const router = useRouter()
    const queryParamsState = useStore(projectCenterStore, (state) => {
        return {
            limit: state.limit,
            page: state.page,
            search: state.search,
            sort: state.sort,
            hiddenFinishItems: state.isHideFinishItems,
        }
    })
    const tabState = useStore(projectCenterStore, (state) => state.tab)

    const updateTabState = (tab: ProjectCenterTabEnum) => {
        projectCenterStore.setState((state) => {
            return {
                ...state,
                tab: tab,
            }
        })
        router.push(`/project-center/${tab}`)
    }

    const updateQueryParamsState = (params?: JobQueryInput) => {
        projectCenterStore.setState((state) => {
            return {
                ...state,
                params,
            }
        })
    }

    return {
        tabState,
        queryParamsState,
        updateTabState,
        updateQueryParamsState,
    }
}
