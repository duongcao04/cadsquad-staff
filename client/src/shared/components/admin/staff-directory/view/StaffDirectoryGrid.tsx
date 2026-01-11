import { INTERNAL_URLS, optimizeCloudinary } from '@/lib'
import { Avatar, Button, Card, Skeleton } from '@heroui/react'
import { Briefcase, Link, Mail, Phone } from 'lucide-react'
import { TStaffSearch } from '../../../../../routes/_administrator/admin/mgmt/staff-directory/index'
import { TUser } from '../../../../types'
import { DepartmentChip } from '../../../chips/DepartmentChip'
import { RoleChip } from '../../../chips/RoleChip'
import {
    HeroCard,
    HeroCardBody,
    HeroCardFooter,
    HeroCardHeader,
} from '../../../ui/hero-card'

type Props = {
    searchParams: TStaffSearch
    isLoading: boolean
    data: TUser[]
    onAddStaff: (user: TUser) => void
}

export default function StaffDirectoryGrid({
    searchParams,
    isLoading,
    data,
    onAddStaff,
}: Props) {
    return (
        <div className="size-full">
            {/* --- Grid Content with Skeleton --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 min-h-112.5">
                {isLoading
                    ? [...Array(searchParams.limit)].map((_, i) => (
                          <StaffSkeleton key={i} />
                      ))
                    : data.map((user) => (
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
                                          src={optimizeCloudinary(user.avatar, {
                                              width: 200,
                                              height: 200,
                                          })}
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
                                  {/* <UserActionDropdown
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
                                  /> */}
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
                                      onPress={() => onAddStaff(user)}
                                  >
                                      Assign Job
                                  </Button>
                              </HeroCardFooter>
                          </HeroCard>
                      ))}
            </div>
        </div>
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
