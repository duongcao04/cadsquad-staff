import { COLORS, INTERNAL_URLS, optimizeCloudinary } from '@/lib'
import { departmentsListOptions, usersListOptions } from '@/lib/queries'
import {
    DepartmentChip,
    HeroCard,
    HeroCardBody,
    HeroCardFooter,
    HeroCardHeader,
    RoleChip,
} from '@/shared/components'
import AdminContentContainer from '@/shared/components/admin/AdminContentContainer'
import { AssignJobModal } from '@/shared/components/staff-directory/AssignJobModal'
import { DeactivateUserModal } from '@/shared/components/staff-directory/DeactiveUserModal'
import { EmailUserModal } from '@/shared/components/staff-directory/EmailUserModal'
import { SendNotificationModal } from '@/shared/components/staff-directory/SendNotificationModal'
import { TUser } from '@/shared/types'
import {
    Avatar,
    Button,
    Card,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    Input,
    Pagination,
    Select,
    SelectItem,
    Skeleton,
    Spinner,
    useDisclosure,
} from '@heroui/react'
import { useSuspenseQueries } from '@tanstack/react-query'
import {
    createFileRoute,
    Link,
    useNavigate,
    useRouter,
} from '@tanstack/react-router'
import lodash from 'lodash'
import {
    Briefcase,
    Filter,
    Mail,
    MoreVertical,
    Phone,
    RefreshCw,
    Search,
    SendIcon,
    UserPen,
} from 'lucide-react'
import { useMemo, useState, useTransition } from 'react'
import { z } from 'zod'

// --- 1. ROUTE DEFINITION WITH SEARCH SCHEMA ---
const staffSearchSchema = z.object({
    page: z.number().catch(1),
    limit: z.number().catch(8),
    search: z.string().optional(),
    departmentId: z.string().optional(),
})
export type TStaffSearch = z.infer<typeof staffSearchSchema>

export const Route = createFileRoute(
    '/_administrator/admin/mgmt/staff-directory/'
)({
    validateSearch: (search) => staffSearchSchema.parse(search),
    loaderDeps: ({ search }) => ({
        page: search.page,
        limit: search.limit,
        search: search.search,
        departmentId: search.departmentId,
    }),
    loader: async ({ context, deps }) => {
        const { departmentId, limit, page, search } = deps
        return Promise.all([
            context.queryClient.ensureQueryData(
                usersListOptions({
                    limit,
                    page,
                    sortBy: 'displayName',
                    sortOrder: 'asc',
                    departmentId,
                    search,
                })
            ),
            context.queryClient.ensureQueryData(departmentsListOptions()),
        ])
    },
    component: StaffDirectoryPage,
})

// --- 2. MAIN PAGE COMPONENT ---
function StaffDirectoryPage() {
    const searchParams = Route.useSearch()
    const navigate = useNavigate({ from: Route.fullPath })

    const [
        {
            data: { users, total: totalUsers, totalPages },
            isFetching: isUsersLoading,
            refetch,
        },
        {
            data: { departments },
        },
    ] = useSuspenseQueries({
        queries: [
            {
                ...usersListOptions({
                    limit: searchParams.limit,
                    page: searchParams.page,
                    sortBy: 'displayName',
                    sortOrder: 'asc',
                    departmentId: searchParams.departmentId,
                    search: searchParams.search,
                }),
            },
            { ...departmentsListOptions() },
        ],
    })

    // --- Disclosure Hooks cho Modals ---
    const [selectedUser, setSelectedUser] = useState<null | TUser>(null)
    const assignJobModal = useDisclosure()
    const emailUserModal = useDisclosure()
    const notificationModal = useDisclosure()
    const deactivateModal = useDisclosure()

    // useTransition is key to preventing the "jump" to Suspense fallback
    const [, startTransition] = useTransition()

    // Generic function to handle all navigation updates with transition
    const updateSearch = (updater: (old: TStaffSearch) => TStaffSearch) => {
        startTransition(() => {
            navigate({
                search: ((old: TStaffSearch) =>
                    updater(old as TStaffSearch)) as unknown as true,
                replace: true,
            })
        })
    }

    const handlePageChange = (newPage: number) =>
        updateSearch((old) => ({ ...old, page: newPage }))

    const handleLimitChange = (newLimit: number) =>
        updateSearch((old) => ({ ...old, limit: newLimit, page: 1 }))

    const handleSearchChange = (newSearch?: string) =>
        updateSearch((old) => ({ ...old, search: newSearch, page: 1 }))

    const debouncedSearchChange = useMemo(
        () =>
            lodash.debounce((value: string) => handleSearchChange(value), 500),
        [handleSearchChange]
    )
    const handleFilters = (deptId: string) => {
        navigate({
            search: (prev) => ({
                ...prev,
                departmentId: deptId === 'all' ? undefined : deptId,
                page: 1,
            }),
        })
    }

    return (
        <>
            {/* Modals Management */}
            {assignJobModal.isOpen && selectedUser && (
                <AssignJobModal
                    isOpen
                    onClose={assignJobModal.onClose}
                    user={selectedUser}
                />
            )}
            {emailUserModal.isOpen && selectedUser && (
                <EmailUserModal
                    isOpen
                    onClose={emailUserModal.onClose}
                    user={selectedUser}
                />
            )}
            {notificationModal.isOpen && selectedUser && (
                <SendNotificationModal
                    isOpen
                    onClose={notificationModal.onClose}
                    user={selectedUser}
                />
            )}
            {deactivateModal.isOpen && selectedUser && (
                <DeactivateUserModal
                    isOpen
                    onClose={deactivateModal.onClose}
                    user={selectedUser}
                />
            )}

            <AdminContentContainer className="mt-1 pb-10">
                {/* --- Toolbar --- */}
                <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
                    <Input
                        isClearable
                        className="w-full md:max-w-md"
                        placeholder="Search name or email..."
                        startContent={
                            <Search size={18} className="text-default-400" />
                        }
                        value={searchParams.search}
                        onValueChange={(val) => {
                            if (!val)
                                handleSearchChange(undefined) // Instant reset on clear
                            else debouncedSearchChange(val)
                        }}
                        variant="bordered"
                    />

                    <Select
                        labelPlacement="outside"
                        className="w-full md:max-w-xs"
                        selectedKeys={[searchParams.departmentId || 'all']}
                        onChange={(e) => handleFilters(e.target.value)}
                        variant="bordered"
                        aria-label="Filter by department"
                        startContent={
                            <Filter size={16} className="text-default-400" />
                        }
                    >
                        {[
                            {
                                code: 'all-departments',
                                createdAt: new Date(),
                                displayName: 'All Departments',
                                hexColor: COLORS.white,
                                id: 'all',
                                notes: 'Empty',
                                updatedAt: new Date(),
                                users: [],
                            },
                            ...departments,
                        ].map((dept) => (
                            <SelectItem
                                key={dept.id}
                                textValue={dept.displayName}
                            >
                                {dept.displayName}
                            </SelectItem>
                        ))}
                    </Select>

                    <div className="w-px mx-3 h-5 bg-text-muted"></div>
                    <div className="flex gap-3">
                        <Button
                            startContent={
                                isUsersLoading ? (
                                    <Spinner size="sm" />
                                ) : (
                                    <RefreshCw
                                        size={14}
                                        className="text-small"
                                    />
                                )
                            }
                            className="border-1"
                            variant="bordered"
                            size="sm"
                            onPress={() => {
                                refetch()
                            }}
                        >
                            <span className="font-medium">Refresh</span>
                        </Button>
                    </div>

                    <div className="ml-auto flex items-center gap-4">
                        <span className="text-default-400 text-xs font-medium">
                            {isUsersLoading
                                ? 'Syncing...'
                                : `${totalUsers || 0} members`}
                        </span>
                        <Select
                            size="sm"
                            className="w-32"
                            selectedKeys={[searchParams.limit.toString()]}
                            onChange={(e) =>
                                handleLimitChange(Number(e.target.value))
                            }
                            disallowEmptySelection
                            variant="bordered"
                            aria-label="Rows per page"
                        >
                            <SelectItem key="8" textValue="8">
                                8 / page
                            </SelectItem>
                            <SelectItem key="12" textValue="12">
                                12 / page
                            </SelectItem>
                            <SelectItem key="24" textValue="24">
                                24 / page
                            </SelectItem>
                        </Select>
                    </div>
                </div>

                {/* --- Grid Content with Skeleton --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 min-h-112.5">
                    {isUsersLoading
                        ? [...Array(searchParams.limit)].map((_, i) => (
                              <StaffSkeleton key={i} />
                          ))
                        : users.map((user) => (
                              <HeroCard
                                  key={user.id}
                                  className="w-full group hover:border-primary transition-all duration-300"
                                  shadow="sm"
                              >
                                  <HeroCardHeader className="justify-between items-start pt-5 px-5">
                                      <div className="flex gap-4">
                                          <Avatar
                                              isBordered
                                              radius="lg"
                                              size="lg"
                                              src={optimizeCloudinary(
                                                  user.avatar,
                                                  { width: 200, height: 200 }
                                              )}
                                              color={
                                                  user.isActive
                                                      ? 'success'
                                                      : 'danger'
                                              }
                                          />
                                          <div className="flex flex-col gap-1 items-start justify-center">
                                              <Link
                                                  to={INTERNAL_URLS.editStaffDetails(
                                                      user.username
                                                  )}
                                              >
                                                  <h4 className="text-sm font-bold hover:text-primary transition-colors line-clamp-1">
                                                      {user.displayName}
                                                  </h4>
                                              </Link>
                                              <h5 className="text-xs text-text-subdued font-medium">
                                                  {user.jobTitle?.displayName ||
                                                      'N/A'}
                                              </h5>
                                          </div>
                                      </div>
                                      <UserActionDropdown
                                          username={user.username}
                                          onEmail={() => {
                                              setSelectedUser(user)
                                              emailUserModal.onOpen()
                                          }}
                                          onNotify={() => {
                                              setSelectedUser(user)
                                              notificationModal.onOpen()
                                          }}
                                          onDeactivate={() => {
                                              setSelectedUser(user)
                                              deactivateModal.onOpen()
                                          }}
                                      />
                                  </HeroCardHeader>

                                  <HeroCardBody className="px-5 pt-2 pb-4 space-y-4">
                                      <div className="flex flex-wrap gap-2">
                                          {user.department && (
                                              <DepartmentChip
                                                  data={user.department}
                                              />
                                          )}
                                          <RoleChip data={user.role} />
                                      </div>
                                      <div className="space-y-2 text-xs text-default-500">
                                          <div className="flex items-center gap-2 truncate">
                                              <Mail size={14} /> {user.email}
                                          </div>
                                          {user.phoneNumber && (
                                              <div className="flex items-center gap-2">
                                                  <Phone size={14} />{' '}
                                                  {user.phoneNumber}
                                              </div>
                                          )}
                                      </div>
                                  </HeroCardBody>

                                  <HeroCardFooter className="px-5 pb-5 pt-0">
                                      <Button
                                          fullWidth
                                          variant="flat"
                                          color="primary"
                                          size="sm"
                                          className="font-bold"
                                          startContent={<Briefcase size={16} />}
                                          onPress={() => {
                                              setSelectedUser(user)
                                              assignJobModal.onOpen()
                                          }}
                                      >
                                          Assign Job
                                      </Button>
                                  </HeroCardFooter>
                              </HeroCard>
                          ))}
                </div>

                {/* --- Pagination UI --- */}
                <div className="flex flex-col md:flex-row justify-between items-center mt-12 px-2 gap-4">
                    <p className="text-xs text-default-500 font-medium order-2 md:order-1">
                        Showing{' '}
                        {users.length > 0
                            ? (searchParams.page - 1) * searchParams.limit + 1
                            : 0}
                        {' - '}
                        {Math.min(
                            searchParams.page * searchParams.limit,
                            totalUsers || 0
                        )}
                        {' of '} {totalUsers || 0} users
                    </p>

                    {totalPages > 1 && (
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="primary"
                            page={searchParams.page}
                            total={totalPages}
                            onChange={handlePageChange}
                            className="order-1 md:order-2"
                            variant="flat"
                        />
                    )}
                </div>
            </AdminContentContainer>
        </>
    )
}

// --- 3. HELPER COMPONENTS ---
function StaffSkeleton() {
    return (
        <Card className="w-full h-61.25 p-5 space-y-5" radius="lg">
            <div className="flex gap-4">
                <Skeleton className="rounded-lg w-14 h-14" />
                <div className="flex flex-col gap-2 flex-1 justify-center">
                    <Skeleton className="h-3 w-4/5 rounded-lg" />
                    <Skeleton className="h-2 w-2/5 rounded-lg" />
                </div>
            </div>
            <div className="space-y-4 pt-2">
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-3 w-full rounded-lg" />
                    <Skeleton className="h-3 w-3/4 rounded-lg" />
                </div>
                <Skeleton className="h-8 w-full rounded-xl mt-2" />
            </div>
        </Card>
    )
}

type UserActionDropdownProps = {
    username: string
    onEmail: () => void
    onNotify: () => void
    onDeactivate: () => void
}
function UserActionDropdown({
    username,
    onEmail,
    onNotify,
    onDeactivate,
}: UserActionDropdownProps) {
    const router = useRouter()
    return (
        <Dropdown>
            <DropdownTrigger>
                <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    className="text-default-400"
                >
                    <MoreVertical size={20} />
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions">
                <DropdownSection showDivider>
                    <DropdownItem
                        key="view"
                        startContent={<UserPen size={16} />}
                        onPress={() => {
                            router.navigate({
                                href: INTERNAL_URLS.editStaffDetails(username),
                            })
                        }}
                    >
                        View Profile
                    </DropdownItem>
                    <DropdownItem
                        key="notify"
                        startContent={<SendIcon size={16} />}
                        onPress={onNotify}
                    >
                        Send Notification
                    </DropdownItem>
                    <DropdownItem
                        key="email"
                        startContent={<Mail size={16} />}
                        onPress={onEmail}
                    >
                        Direct Email
                    </DropdownItem>
                </DropdownSection>
                <DropdownSection title="Danger zone">
                    <DropdownItem
                        key="delete"
                        className="text-danger"
                        color="danger"
                        onPress={onDeactivate}
                    >
                        Deactivate User
                    </DropdownItem>
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    )
}
