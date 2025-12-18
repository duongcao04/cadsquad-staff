import {
    dateFormatter,
    editUserSchema,
    EditUserValues,
    INTERNAL_URLS,
    optimizeCloudinary,
    ROLES_LIST,
    useUpdateAvatarMutation,
    useUpdateUserMutation,
    useUploadImageMutation,
} from '@/lib'
import { departmentsListOptions } from '@/lib/queries/options/department-queries'
import { jobTitlesListOptions } from '@/lib/queries/options/job-title-queries'
import { userOptions } from '@/lib/queries/options/user-queries'
import {
    HeroBreadcrumbItem,
    HeroBreadcrumbs,
    HeroButton,
} from '@/shared/components'
import AdminContentContainer from '@/shared/components/admin/AdminContentContainer'
import HeroCopyButton from '@/shared/components/ui/hero-copy-button'
import {
    addToast,
    Avatar,
    Button,
    Card,
    CardBody,
    CardHeader,
    Chip,
    Divider,
    Input,
    Select,
    SelectItem,
    Switch,
    Tab,
    Tabs,
    Textarea,
    useDisclosure,
} from '@heroui/react'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useFormik } from 'formik'
import {
    AlertCircle,
    ArrowLeft,
    Briefcase,
    Building,
    Calendar,
    Github,
    KeyRound,
    Linkedin,
    Mail,
    Phone,
    Save,
    Shield,
    Trash2,
    Upload,
    User,
} from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'
import ResetPasswordModal from '@/shared/components/modals/ResetPasswordModal'
import { UploadAvatarModal } from '../../../../../../shared/components/modals/UploadAvatarModal'

// --- Helper to connect Zod to Formik without extra deps ---
const toFormikValidate = <T extends z.ZodType<any, any>>(schema: T) => {
    return (values: any) => {
        const result = schema.safeParse(values)
        if (!result.success) {
            // Convert Zod error structure to Formik error structure
            const errors: Record<string, string> = {}
            result.error.issues.forEach((issue) => {
                const path = issue.path[0]
                if (path) {
                    errors[path.toString()] = issue.message
                }
            })
            return errors
        }
        return {}
    }
}

export const Route = createFileRoute(
    '/_administrator/admin/mgmt/staff-directory/$username/edit'
)({
    loader: ({ context, params }) => {
        const { username } = params
        return context.queryClient.ensureQueryData(userOptions(username))
    },
    component: EditStaffPage,
})

function EditStaffPage() {
    const { username } = Route.useParams()

    const uploadImageMutation = useUploadImageMutation()
    const updateAvatarMutation = useUpdateAvatarMutation()
    // 1. Fetch Data
    const options = userOptions(username)
    const { data: user } = useSuspenseQuery(options)

    const { data: departments } = useQuery({
        ...departmentsListOptions(),
    })

    const { data: jobTitles } = useQuery({
        ...jobTitlesListOptions(),
    })

    const [activeTab, setActiveTab] = useState('profile')
    const updateUserMutation = useUpdateUserMutation()

    const {
        isOpen: isOpenResetPasswordModal,
        onOpen: onOpenResetPasswordModal,
        onClose: onCloseResetPasswordModal,
    } = useDisclosure({
        id: 'ResetPasswordModal',
    })
    const {
        isOpen: isOpenUploadAvatarModal,
        onOpen: onOpenUploadAvatarModal,
        onClose: onCloseUploadAvatarModal,
    } = useDisclosure({
        id: 'UploadAvatarModal',
    })

    // 2. Initialize Formik
    const formik = useFormik<EditUserValues>({
        initialValues: {
            displayName: user.displayName || '',
            username: user.username || '',
            email: user.email || '',
            phoneNumber: user.phoneNumber || '',
            github: '',
            linkedin: '',
            bio: user.bio || '', // Assuming bio exists on user, otherwise ''
            departmentId: user.department?.id || '',
            jobTitleId: user.jobTitle?.id || '',
            role: (user.role as 'ADMIN' | 'USER' | 'ACCOUNTING') || 'USER',
            isActive: user.isActive ?? true,
        },
        validate: toFormikValidate(editUserSchema),
        onSubmit: async (values) => {
            console.log('Submitting validated data:', values)
            try {
                // Call your mutation here
                await updateUserMutation.mutateAsync({
                    // Adjust according to what your mutation expects (e.g., username + body)
                    username: user.username,
                    data: values,
                })
            } catch (error) {
                console.error('Failed to update user', error)
            }
        },
    })

    const handleAvatarSave = async (imageFile: File) => {
        try {
            // Step 1: Upload the file to get the URL
            console.log('Uploading image...')
            const newAvatarUrl =
                await uploadImageMutation.mutateAsync(imageFile)

            if (!newAvatarUrl) throw new Error('Failed to get image URL')

            // Step 2: Update the user record with this URL
            console.log('Updating user profile...', newAvatarUrl)
            await updateAvatarMutation.mutateAsync({
                username: user.username,
                avatarUrl: newAvatarUrl,
            })
        } catch (error) {
            console.error(error)
            addToast({
                title: 'Failed to update avatar',
                color: 'danger',
            })
        }
    }

    return (
        <>
            {isOpenResetPasswordModal && user && (
                <ResetPasswordModal
                    isOpen={isOpenResetPasswordModal}
                    onClose={onCloseResetPasswordModal}
                    data={user}
                />
            )}
            {isOpenUploadAvatarModal && (
                <UploadAvatarModal
                    isOpen={isOpenUploadAvatarModal}
                    onClose={onCloseUploadAvatarModal}
                    onSave={handleAvatarSave}
                    currentAvatarUrl={optimizeCloudinary(user.avatar, {
                        width: 256,
                        height: 256,
                    })}
                />
            )}
            <HeroBreadcrumbs className="pt-3 px-7 text-xs">
                <HeroBreadcrumbItem>Management</HeroBreadcrumbItem>
                <HeroBreadcrumbItem>
                    <Link
                        to={INTERNAL_URLS.staffDirectory}
                        className="text-text-subdued!"
                    >
                        Staff Directory
                    </Link>
                </HeroBreadcrumbItem>
                <HeroBreadcrumbItem>
                    <span className="font-medium">@{user?.username}</span>
                </HeroBreadcrumbItem>
            </HeroBreadcrumbs>

            <AdminContentContainer className="mt-1">
                {/* --- Header --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Link to={INTERNAL_URLS.staffDirectory}>
                            <HeroButton
                                isIconOnly
                                variant="light"
                                size="sm"
                                color="default"
                            >
                                <ArrowLeft size={16} />
                            </HeroButton>
                        </Link>
                        <div className="flex items-center justify-start gap-2">
                            <p className="font-medium text-sm">
                                Edit member details
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            color="danger"
                            variant="light"
                            onPress={onOpenResetPasswordModal}
                        >
                            Reset Password
                        </Button>
                        <HeroButton
                            color="primary"
                            size="sm"
                            startContent={
                                !formik.isSubmitting && <Save size={18} />
                            }
                            isLoading={formik.isSubmitting}
                            onPress={() => formik.handleSubmit()}
                        >
                            Save Changes
                        </HeroButton>
                    </div>
                </div>

                <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* --- LEFT COLUMN: Profile Card (Static/Visual) --- */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="shadow-sm border border-slate-200">
                            <CardBody className="flex flex-col items-center p-8 text-center">
                                <div className="relative mb-4 group">
                                    <Avatar
                                        src={optimizeCloudinary(user.avatar, {
                                            width: 512,
                                            height: 512,
                                        })}
                                        className="w-32 h-32 text-large border-4 border-slate-50 shadow-md"
                                    />
                                    {/* Upload Logic would go here */}
                                    <div
                                        className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                        onClick={onOpenUploadAvatarModal}
                                    >
                                        <Upload
                                            className="text-white"
                                            size={24}
                                        />
                                    </div>
                                </div>

                                <h2 className="text-xl font-bold text-slate-900">
                                    {formik.values.displayName}
                                </h2>
                                <p className="text-sm text-slate-500 mb-4">
                                    @{formik.values.username}
                                </p>

                                <Chip
                                    color={
                                        formik.values.isActive
                                            ? 'success'
                                            : 'default'
                                    }
                                    variant="flat"
                                    className="mb-6"
                                >
                                    {formik.values.isActive
                                        ? 'Active Account'
                                        : 'Inactive'}
                                </Chip>

                                <div className="w-full space-y-4 text-left">
                                    <Divider />
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-subdued flex items-center gap-2">
                                            <Calendar size={14} /> Joined
                                        </span>
                                        <span className="font-semibold text-text-8">
                                            {dateFormatter(user.createdAt, {
                                                format: 'longDate',
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-subdued flex items-center gap-2">
                                            <Shield size={14} /> Role
                                        </span>
                                        <span className="font-semibold text-text-8">
                                            {formik.values.role}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-subdued flex items-center gap-2">
                                            <Briefcase size={14} /> ID
                                        </span>
                                        <div className="flex items-center justify-end gap-1">
                                            <HeroCopyButton
                                                textValue={user.id}
                                            />
                                            <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                                                {user.id}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Account Actions / Danger Zone */}
                        <Card className="shadow-none border border-red-200 bg-red-50/50">
                            <CardHeader className="px-6 pt-6 pb-0">
                                <h4 className="font-bold text-red-900 text-sm flex items-center gap-2">
                                    <AlertCircle size={16} /> Danger Zone
                                </h4>
                            </CardHeader>
                            <CardBody className="p-6">
                                <p className="text-xs text-red-700 mb-4">
                                    Deactivating this user will revoke all
                                    access to the dashboard immediately.
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-sm text-slate-700">
                                        Account Status
                                    </span>
                                    <Switch
                                        color="success"
                                        isSelected={formik.values.isActive}
                                        onValueChange={(v) =>
                                            formik.setFieldValue('isActive', v)
                                        }
                                    />
                                </div>
                                <Button
                                    className="w-full mt-4 bg-white border border-red-200 text-red-600 hover:bg-red-50"
                                    variant="flat"
                                    startContent={<Trash2 size={16} />}
                                >
                                    Delete User Permanently
                                </Button>
                            </CardBody>
                        </Card>
                    </div>

                    {/* --- RIGHT COLUMN: Edit Form with Formik --- */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-sm border border-slate-200 min-h-150">
                            <CardHeader className="p-0 border-b border-border-default">
                                <Tabs
                                    aria-label="User Edit Tabs"
                                    variant="underlined"
                                    color="primary"
                                    classNames={{
                                        tabList: 'p-4 gap-6',
                                        cursor: 'w-full bg-primary',
                                        tab: 'max-w-fit px-0 h-10',
                                        tabContent:
                                            'group-data-[selected=true]:text-primary font-semibold text-slate-500',
                                    }}
                                    selectedKey={activeTab}
                                    onSelectionChange={(k) =>
                                        setActiveTab(k as string)
                                    }
                                >
                                    <Tab
                                        key="profile"
                                        title={
                                            <div className="flex items-center gap-2">
                                                <User size={16} /> Personal Info
                                            </div>
                                        }
                                    />
                                    <Tab
                                        key="organization"
                                        title={
                                            <div className="flex items-center gap-2">
                                                <Briefcase size={16} />{' '}
                                                Organization
                                            </div>
                                        }
                                    />
                                    <Tab
                                        key="security"
                                        title={
                                            <div className="flex items-center gap-2">
                                                <KeyRound size={16} /> Security
                                            </div>
                                        }
                                    />
                                </Tabs>
                            </CardHeader>

                            <CardBody className="p-6">
                                {/* TAB: PERSONAL INFO */}
                                {activeTab === 'profile' && (
                                    <div className="space-y-6 animate-in fade-in">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Input
                                                label="Full Name"
                                                labelPlacement="outside"
                                                placeholder="e.g. Sarah Wilson"
                                                variant="bordered"
                                                name="displayName"
                                                value={
                                                    formik.values.displayName
                                                }
                                                onValueChange={(v) =>
                                                    formik.setFieldValue(
                                                        'displayName',
                                                        v
                                                    )
                                                }
                                                isInvalid={
                                                    !!formik.errors
                                                        .displayName &&
                                                    formik.touched.displayName
                                                }
                                                errorMessage={
                                                    formik.touched
                                                        .displayName &&
                                                    formik.errors.displayName
                                                }
                                                onBlur={formik.handleBlur}
                                            />
                                            <Input
                                                label="Username"
                                                labelPlacement="outside"
                                                placeholder="e.g. sarah_w"
                                                variant="bordered"
                                                name="username"
                                                value={formik.values.username}
                                                onValueChange={(v) =>
                                                    formik.setFieldValue(
                                                        'username',
                                                        v
                                                    )
                                                }
                                                isInvalid={
                                                    !!formik.errors.username &&
                                                    formik.touched.username
                                                }
                                                errorMessage={
                                                    formik.touched.username &&
                                                    formik.errors.username
                                                }
                                                onBlur={formik.handleBlur}
                                            />
                                            <Input
                                                label="Email Address"
                                                labelPlacement="outside"
                                                placeholder="sarah@company.com"
                                                variant="bordered"
                                                startContent={
                                                    <Mail
                                                        className="text-slate-400"
                                                        size={16}
                                                    />
                                                }
                                                name="email"
                                                value={formik.values.email}
                                                onValueChange={(v) =>
                                                    formik.setFieldValue(
                                                        'email',
                                                        v
                                                    )
                                                }
                                                isInvalid={
                                                    !!formik.errors.email &&
                                                    formik.touched.email
                                                }
                                                errorMessage={
                                                    formik.touched.email &&
                                                    formik.errors.email
                                                }
                                                onBlur={formik.handleBlur}
                                            />
                                            <Input
                                                label="Phone Number"
                                                labelPlacement="outside"
                                                placeholder="+1..."
                                                variant="bordered"
                                                startContent={
                                                    <Phone
                                                        className="text-slate-400"
                                                        size={16}
                                                    />
                                                }
                                                name="phoneNumber"
                                                value={
                                                    formik.values.phoneNumber
                                                }
                                                onValueChange={(v) =>
                                                    formik.setFieldValue(
                                                        'phoneNumber',
                                                        v
                                                    )
                                                }
                                                isInvalid={
                                                    !!formik.errors
                                                        .phoneNumber &&
                                                    formik.touched.phoneNumber
                                                }
                                                errorMessage={
                                                    formik.touched
                                                        .phoneNumber &&
                                                    formik.errors.phoneNumber
                                                }
                                                onBlur={formik.handleBlur}
                                            />
                                            {/* --- SOCIAL PROFILES (Mapped to UserConfig) --- */}
                                            <div className="md:col-span-2 pt-4 border-t border-border-default mt-2">
                                                <p className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                                    Social Profiles{' '}
                                                    <span className="text-xs font-normal text-slate-400">
                                                        (Saved in User Config)
                                                    </span>
                                                </p>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <Input
                                                        label="LinkedIn Profile"
                                                        labelPlacement="outside"
                                                        placeholder="https://linkedin.com/in/..."
                                                        variant="bordered"
                                                        startContent={
                                                            <Linkedin
                                                                className="text-blue-600"
                                                                size={16}
                                                            />
                                                        }
                                                        name="linkedin"
                                                        value={
                                                            formik.values
                                                                .linkedin
                                                        }
                                                        onValueChange={(v) =>
                                                            formik.setFieldValue(
                                                                'linkedin',
                                                                v
                                                            )
                                                        }
                                                        isInvalid={
                                                            !!formik.errors
                                                                .linkedin &&
                                                            formik.touched
                                                                .linkedin
                                                        }
                                                        errorMessage={
                                                            formik.touched
                                                                .linkedin &&
                                                            formik.errors
                                                                .linkedin
                                                        }
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                    />
                                                    <Input
                                                        label="GitHub Profile"
                                                        labelPlacement="outside"
                                                        placeholder="https://github.com/..."
                                                        variant="bordered"
                                                        startContent={
                                                            <Github
                                                                className="text-slate-700"
                                                                size={16}
                                                            />
                                                        }
                                                        name="github"
                                                        value={
                                                            formik.values.github
                                                        }
                                                        onValueChange={(v) =>
                                                            formik.setFieldValue(
                                                                'github',
                                                                v
                                                            )
                                                        }
                                                        isInvalid={
                                                            !!formik.errors
                                                                .github &&
                                                            formik.touched
                                                                .github
                                                        }
                                                        errorMessage={
                                                            formik.touched
                                                                .github &&
                                                            formik.errors.github
                                                        }
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* TAB: ORGANIZATION */}
                                {activeTab === 'organization' && (
                                    <div className="space-y-6 animate-in fade-in">
                                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                                            <h4 className="text-sm font-bold text-blue-900 mb-1">
                                                Permissions & Access
                                            </h4>
                                            <p className="text-xs text-blue-700">
                                                Changing the Department or Role
                                                will immediately affect what
                                                this user can see.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Select
                                                label="Department"
                                                labelPlacement="outside"
                                                variant="bordered"
                                                selectedKeys={
                                                    formik.values.departmentId
                                                        ? [
                                                              formik.values
                                                                  .departmentId,
                                                          ]
                                                        : []
                                                }
                                                onSelectionChange={(keys) =>
                                                    formik.setFieldValue(
                                                        'departmentId',
                                                        Array.from(keys)[0]
                                                    )
                                                }
                                                startContent={
                                                    <Building
                                                        className="text-slate-400"
                                                        size={16}
                                                    />
                                                }
                                                isInvalid={
                                                    !!formik.errors
                                                        .departmentId &&
                                                    formik.touched.departmentId
                                                }
                                                errorMessage={
                                                    formik.touched
                                                        .departmentId &&
                                                    formik.errors.departmentId
                                                }
                                            >
                                                {departments
                                                    ? departments.map((d) => (
                                                          <SelectItem
                                                              key={d.id}
                                                              value={d.id}
                                                              textValue={
                                                                  d.displayName
                                                              }
                                                          >
                                                              {d.displayName}
                                                          </SelectItem>
                                                      ))
                                                    : []}
                                            </Select>

                                            <Select
                                                label="Job Title"
                                                labelPlacement="outside"
                                                variant="bordered"
                                                selectedKeys={
                                                    formik.values.jobTitleId
                                                        ? [
                                                              formik.values
                                                                  .jobTitleId,
                                                          ]
                                                        : []
                                                }
                                                onSelectionChange={(keys) =>
                                                    formik.setFieldValue(
                                                        'jobTitleId',
                                                        Array.from(keys)[0]
                                                    )
                                                }
                                                startContent={
                                                    <Briefcase
                                                        className="text-slate-400"
                                                        size={16}
                                                    />
                                                }
                                                isInvalid={
                                                    !!formik.errors
                                                        .jobTitleId &&
                                                    formik.touched.jobTitleId
                                                }
                                                errorMessage={
                                                    formik.touched.jobTitleId &&
                                                    formik.errors.jobTitleId
                                                }
                                            >
                                                {jobTitles
                                                    ? jobTitles.map((j) => (
                                                          <SelectItem
                                                              key={j.id}
                                                              value={j.id}
                                                              textValue={
                                                                  j.displayName
                                                              }
                                                          >
                                                              {j.displayName}
                                                          </SelectItem>
                                                      ))
                                                    : []}
                                            </Select>

                                            <div className="md:col-span-2">
                                                <Select
                                                    label="System Role"
                                                    labelPlacement="outside"
                                                    variant="bordered"
                                                    selectedKeys={[
                                                        formik.values.role,
                                                    ]}
                                                    onSelectionChange={(keys) =>
                                                        formik.setFieldValue(
                                                            'role',
                                                            Array.from(keys)[0]
                                                        )
                                                    }
                                                    startContent={
                                                        <Shield
                                                            className="text-slate-400"
                                                            size={16}
                                                        />
                                                    }
                                                    description="Admins have full access. Accounting sees financial data. Users see assigned jobs."
                                                    isInvalid={
                                                        !!formik.errors.role &&
                                                        formik.touched.role
                                                    }
                                                    errorMessage={
                                                        formik.touched.role &&
                                                        formik.errors.role
                                                    }
                                                >
                                                    {ROLES_LIST.map((r) => (
                                                        <SelectItem
                                                            key={r.value}
                                                            value={r.value}
                                                            textValue={r.label}
                                                        >
                                                            {r.label}
                                                        </SelectItem>
                                                    ))}
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* TAB: SECURITY */}
                                {activeTab === 'security' && (
                                    <div className="space-y-6 animate-in fade-in">
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-sm mb-4">
                                                Password Management
                                            </h3>
                                            <div className="flex justify-between items-center p-4 border border-slate-200 rounded-xl">
                                                <div>
                                                    <p className="font-semibold text-slate-700">
                                                        Send Password Reset
                                                        Email
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        User will receive a link
                                                        to set a new password.
                                                    </p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="flat"
                                                    color="primary"
                                                >
                                                    Send Link
                                                </Button>
                                            </div>
                                        </div>

                                        <Divider />

                                        <div>
                                            <h3 className="font-bold text-slate-800 text-sm mb-4">
                                                Session Control
                                            </h3>
                                            <div className="flex justify-between items-center p-4 border border-slate-200 rounded-xl bg-slate-50">
                                                <div>
                                                    <p className="font-semibold text-slate-700">
                                                        Force Logout
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        Sign out this user from
                                                        all active devices
                                                        immediately.
                                                    </p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="bordered"
                                                    color="danger"
                                                >
                                                    Log Out All
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </AdminContentContainer>
        </>
    )
}
