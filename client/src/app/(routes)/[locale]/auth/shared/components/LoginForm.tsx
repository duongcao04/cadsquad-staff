'use client'

import { useState } from 'react'

import { addToast, Button, Input } from '@heroui/react'
import { useFormik } from 'formik'
import { Eye, EyeOff } from 'lucide-react'

import { Link, useRouter } from '@/i18n/navigation'
import { envConfig } from '@/shared/config'
import { useSearchParam } from '@/shared/hooks'
import { useLogin } from '@/shared/queries'
import { LoginInput, LoginInputSchema } from '@/shared/validationSchemas'
import { useTranslations } from 'next-intl'

const HOME = String(envConfig.NEXT_PUBLIC_URL)

export function LoginForm() {
    const t = useTranslations()
    const router = useRouter()
    const { getSearchParam } = useSearchParam()
    const redirect = getSearchParam('redirect') ?? '/'

    const [isVisible, setIsVisible] = useState(false)
    const toggleVisibility = () => setIsVisible(!isVisible)

    const { mutateAsync: loginMutate, isPending: isLoggingIn } = useLogin()

    const formik = useFormik<LoginInput>({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: LoginInputSchema,
        onSubmit: async (values) => {
            await loginMutate(
                {
                    email: values.email,
                    password: values.password,
                },
                {
                    onSuccess(res) {
                        addToast({ title: res.data.message, color: 'success' })
                        router.replace(redirect)
                    },
                    onError(error) {
                        addToast({
                            title: error.error,
                            description: `Error: ${error.message}`,
                            color: 'danger',
                        })
                    },
                }
            )
        },
    })

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="min-w-[600px] shadow-lg rounded-sm py-8 p-16 bg-background"
        >
            <h1 className="text-2xl font-bold text-left font-saira">
                {t('signIn')}
            </h1>
            <p>
                {t('toContinueTo')}{' '}
                <Link
                    href={HOME}
                    className="text-blue-700 hover:underline underline-offset-2"
                >
                    staff.cadsquad.vn
                </Link>
            </p>
            <div className="mt-5 space-y-5">
                <Input
                    isRequired
                    id="email"
                    name="email"
                    label={t('email')}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    isInvalid={
                        Boolean(formik.touched.email) &&
                        Boolean(formik.errors.email)
                    }
                    errorMessage={
                        Boolean(formik.touched.email) && formik.errors.email
                    }
                />
                <Input
                    isRequired
                    id="password"
                    name="password"
                    label={t('password')}
                    type={isVisible ? 'text' : 'password'}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    endContent={
                        <Button
                            isIconOnly
                            onPress={toggleVisibility}
                            variant="light"
                        >
                            {isVisible ? <Eye /> : <EyeOff />}
                        </Button>
                    }
                    isInvalid={
                        Boolean(formik.touched.password) &&
                        Boolean(formik.errors.password)
                    }
                    errorMessage={
                        Boolean(formik.touched.password) &&
                        formik.errors.password
                    }
                />
                <p className="ml-1 text-sm">
                    {t('support')}? {t('contactTo')}{' '}
                    <Link
                        href={'mailto:ch.duong@cadsquad.vn'}
                        className="text-blue-700 hover:underline underline-offset-2"
                    >
                        Ch.duong@cadsquad.vn
                    </Link>
                </p>
                <div className="mt-10 w-[80%] mx-auto grid place-items-center">
                    <Button
                        color="danger"
                        className="w-full rounded-sm"
                        type="submit"
                        isLoading={isLoggingIn}
                    >
                        {t('login')}
                    </Button>
                    {/* <div className="flex items-center justify-between w-full gap-3">
                        <hr className="w-full opacity-20" />
                        <p className="my-5 opacity-70">{t('or')}</p>
                        <hr className="w-full opacity-20" />
                    </div>
                    <Button
                        type="button"
                        color="secondary"
                        className="w-full rounded-full"
                        isLoading={isLoading}
                        startContent={<IconMicrosoftColorful />}
                        variant="bordered"
                        onPress={loginWithMicrosoft}
                    >
                        <p className="px-2">Login with Microsoft</p>
                    </Button> */}
                </div>
            </div>
        </form>
    )
}
