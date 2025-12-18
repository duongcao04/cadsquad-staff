import { createFileRoute, Link } from '@tanstack/react-router'

import {
    Card,
    CardBody,
    CardHeader,
    Input,
    Button,
    Avatar,
    Divider,
    useDisclosure,
    Chip,
    toast,
} from '@heroui/react'
import {
    Save,
    User,
    Mail,
    Phone,
    Building,
    Briefcase,
    Github,
    Linkedin,
    Camera,
    Calendar,
    House,
} from 'lucide-react'
import { useFormik } from 'formik'
import {
    useMutation,
    useQueryClient,
    useSuspenseQuery,
} from '@tanstack/react-query'
import {
    dateFormatter,
    editUserSchema,
    imageApi,
    INTERNAL_URLS,
    optimizeCloudinary,
    toFormikValidate,
} from '../../lib'
import UploadAvatarModal from '../../shared/components/personal-settings/UploadAvatarModal'
import { HeroBreadcrumbs, HeroBreadcrumbItem } from '../../shared/components'
import { profileOptions } from '../../lib/queries/options/user-queries'

export const Route = createFileRoute('/settings/my-profile')({
    loader: ({ context }) => {
        return context.queryClient.ensureQueryData(profileOptions())
    },
    component: SettingsProfilePage,
})

function SettingsProfilePage() {
    const queryClient = useQueryClient()
    const { data: user, isLoading } = useSuspenseQuery({
        ...profileOptions(),
    })

    // Avatar Modal State
    const {
        isOpen: isAvatarOpen,
        onOpen: onAvatarOpen,
        onOpenChange: onAvatarChange,
    } = useDisclosure()

    // Mutation for updating profile info
    const updateProfileMutation = useMutation({
        mutationFn: async (data: any) => {
            console.log('Updating profile:', data)
            // await axiosClient.patch('/users/me', data);
            await new Promise((r) => setTimeout(r, 1000)) // Mock delay
        },
        onSuccess: () => {
            toast.success('Profile updated successfully')
            queryClient.invalidateQueries({ queryKey: ['me'] })
        },
    })

    // Mutation specifically for Avatar
    const updateAvatarMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            // 1. Upload Image
            const file = formData.get('avatar') as File
            const secureUrl = await imageApi.upload(file)

            if (!secureUrl) throw new Error('Upload failed')

            // 2. Update User Profile with new URL
            // await axiosClient.patch('/users/me', { avatar: secureUrl });
            console.log('New Avatar URL:', secureUrl)

            return secureUrl
        },
        onSuccess: () => {
            toast.success('Avatar updated!')
            queryClient.invalidateQueries({ queryKey: ['me'] })
        },
        onError: () => {
            toast.error('Failed to update avatar.')
        },
    })

    // Prepare Social Links from Config
    const socialConfig = user?.configs?.find(
        (c: any) => c.code === 'USER_PROFILE_LINKS'
    )
    const socialValues = (socialConfig?.value as any) || {}

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            displayName: user?.displayName || '',
            username: user?.username || '',
            email: user?.email || '',
            phoneNumber: user?.phoneNumber || '',
            // Socials
            linkedin: socialValues.linkedin || '',
            github: socialValues.github || '',
            // Read-only/Hidden fields for schema compliance
            role: user?.role || 'USER',
            isActive: true,
        },
        // We reuse the schema but might want to omit role/active checks for self-update
        validate: toFormikValidate(editUserSchema.partial()),
        onSubmit: (values) => {
            updateProfileMutation.mutate({
                ...values,
                // Re-construct config object for backend
                configs: [
                    {
                        code: 'USER_PROFILE_LINKS',
                        value: {
                            linkedin: values.linkedin,
                            github: values.github,
                        },
                    },
                ],
            })
        },
    })

    if (isLoading) return <div className="p-8">Loading profile...</div>

    return (
        <>
            <HeroBreadcrumbs className="text-xs">
                <HeroBreadcrumbItem>
                    <Link
                        to={INTERNAL_URLS.home}
                        className="text-text-subdued!"
                    >
                        <House size={16} />
                    </Link>
                </HeroBreadcrumbItem>
                <HeroBreadcrumbItem>
                    <Link
                        to={INTERNAL_URLS.settings}
                        className="text-text-subdued!"
                    >
                        Settings
                    </Link>
                </HeroBreadcrumbItem>
                <HeroBreadcrumbItem>My Profile</HeroBreadcrumbItem>
            </HeroBreadcrumbs>

            <div className="mt-5">
                {/* Header */}
                <div>
                    <h1 className="text-xl font-bold text-text-default mb-1">
                        My Profile
                    </h1>
                    <p className="text-sm text-text-subdued">
                        Manage your personal information and public profile.
                    </p>
                </div>

                <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* --- LEFT: Avatar & Identity Card --- */}
                    <div className="md:col-span-1 space-y-6">
                        <Card className="shadow-sm border border-border-default">
                            <CardBody className="flex flex-col items-center text-center p-6">
                                {/* Avatar Trigger */}
                                <div className="relative group mb-4">
                                    <Avatar
                                        src={optimizeCloudinary(user?.avatar, {
                                            width: 512,
                                            height: 512,
                                        })}
                                        className="w-32 h-32 text-large ring-4 ring-offset-2 ring-slate-50 shadow-lg"
                                    />
                                    <button
                                        onClick={onAvatarOpen}
                                        className="absolute inset-0 bg-white/20 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-[2px]"
                                    >
                                        <Camera
                                            className="text-white mb-1"
                                            size={24}
                                        />
                                        <span className="text-white text-xs font-bold">
                                            Change
                                        </span>
                                    </button>
                                </div>

                                <h2 className="mt-1 text-xl font-bold text-text-default">
                                    {user?.displayName}
                                </h2>
                                <p className="text-sm text-text-subdued mt-0.5 mb-4">
                                    @{user?.username}
                                </p>

                                <Chip
                                    size="sm"
                                    variant="flat"
                                    color="primary"
                                    className="mb-6"
                                >
                                    {user?.role}
                                </Chip>

                                <Divider className="my-3" />
                                <div className="w-full space-y-3 text-left">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-text-subdued flex items-center gap-2">
                                            <Building size={14} /> Dept
                                        </span>
                                        <span className="font-semibold text-text-default">
                                            {user?.department?.displayName ||
                                                'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-text-subdued flex items-center gap-2">
                                            <Briefcase size={14} /> Title
                                        </span>
                                        <span className="font-semibold text-text-default">
                                            {user?.jobTitle?.displayName ||
                                                'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-text-subdued flex items-center gap-2">
                                            <Calendar size={14} /> Joined
                                        </span>
                                        <span className="font-semibold text-text-default">
                                            {dateFormatter(user?.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* --- RIGHT: Edit Form --- */}
                    <div className="md:col-span-2">
                        <Card className="shadow-sm border border-border-default">
                            <CardHeader className="px-6 py-4 border-b border-border-default">
                                <h3 className="font-bold text-text-default text-lg">
                                    Personal Details
                                </h3>
                            </CardHeader>
                            <CardBody className="p-6 gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Display Name"
                                        labelPlacement="outside"
                                        placeholder="Your full name"
                                        variant="bordered"
                                        name="displayName"
                                        value={formik.values.displayName}
                                        onValueChange={(v) =>
                                            formik.setFieldValue(
                                                'displayName',
                                                v
                                            )
                                        }
                                        isInvalid={!!formik.errors.displayName}
                                        errorMessage={
                                            formik.errors.displayName as string
                                        }
                                    />
                                    <Input
                                        label="Phone Number"
                                        labelPlacement="outside"
                                        placeholder="+1 234 567 890"
                                        variant="bordered"
                                        startContent={
                                            <Phone
                                                size={16}
                                                className="text-slate-400"
                                            />
                                        }
                                        name="phoneNumber"
                                        value={formik.values.phoneNumber}
                                        onValueChange={(v) =>
                                            formik.setFieldValue(
                                                'phoneNumber',
                                                v
                                            )
                                        }
                                    />
                                    <Input
                                        label="Email"
                                        labelPlacement="outside"
                                        variant="flat"
                                        isReadOnly
                                        startContent={
                                            <Mail
                                                size={16}
                                                className="text-slate-400"
                                            />
                                        }
                                        value={formik.values.email}
                                        description="Contact admin to change email."
                                        className="opacity-70"
                                    />
                                    <Input
                                        label="Username"
                                        labelPlacement="outside"
                                        variant="flat"
                                        isReadOnly
                                        startContent={
                                            <User
                                                size={16}
                                                className="text-slate-400"
                                            />
                                        }
                                        value={formik.values.username}
                                        className="opacity-70"
                                    />
                                </div>

                                <Divider />

                                <div>
                                    <h4 className="font-semibold text-primary mb-4">
                                        Social Profiles
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input
                                            label="LinkedIn"
                                            labelPlacement="outside"
                                            placeholder="https://linkedin.com/in/..."
                                            variant="bordered"
                                            startContent={
                                                <Linkedin
                                                    size={16}
                                                    className="text-blue-600"
                                                />
                                            }
                                            name="linkedin"
                                            value={formik.values.linkedin}
                                            onValueChange={(v) =>
                                                formik.setFieldValue(
                                                    'linkedin',
                                                    v
                                                )
                                            }
                                            isInvalid={!!formik.errors.linkedin}
                                            errorMessage={
                                                formik.errors.linkedin as string
                                            }
                                        />
                                        <Input
                                            label="GitHub"
                                            labelPlacement="outside"
                                            placeholder="https://github.com/..."
                                            variant="bordered"
                                            startContent={
                                                <Github
                                                    size={16}
                                                    className="text-text-subdued"
                                                />
                                            }
                                            name="github"
                                            value={formik.values.github}
                                            onValueChange={(v) =>
                                                formik.setFieldValue(
                                                    'github',
                                                    v
                                                )
                                            }
                                            isInvalid={!!formik.errors.github}
                                            errorMessage={
                                                formik.errors.github as string
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button
                                        color="primary"
                                        onPress={() => formik.handleSubmit()}
                                        isLoading={
                                            updateProfileMutation.isPending
                                        }
                                        startContent={
                                            !updateProfileMutation.isPending && (
                                                <Save size={18} />
                                            )
                                        }
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>

                {/* --- AVATAR UPLOAD MODAL --- */}
                <UploadAvatarModal
                    isOpen={isAvatarOpen}
                    onClose={() => onAvatarChange(false)}
                    onSave={(formData) => updateAvatarMutation.mutate(formData)}
                    currentAvatarUrl={user?.avatar}
                    userName={user?.displayName}
                />
            </div>
        </>
    )
}
