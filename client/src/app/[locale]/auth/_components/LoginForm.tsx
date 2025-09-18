'use client'

import React, { useState } from 'react'

import { Button, Input, addToast } from '@heroui/react'
import { useFormik } from 'formik'
import { Eye, EyeOff } from 'lucide-react'

import envConfig from '@/config/envConfig'
import { Link, useRouter } from '@/i18n/navigation'
import useAuth from '@/queries/useAuth'
import { useSearchParam } from '@/shared/hooks/useSearchParam'
import { LoginSchema } from '@/validationSchemas/auth.schema'

const HOME = envConfig.NEXT_PUBLIC_URL as string

export default function LoginForm() {
    const { login } = useAuth()
    const router = useRouter()
    const { getSearchParam } = useSearchParam()
    const redirect = getSearchParam('redirect') ?? '/'

    const [isVisible, setIsVisible] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const toggleVisibility = () => setIsVisible(!isVisible)

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: LoginSchema,
        onSubmit: async (values) => {
            try {
                console.log(values);

                setLoading(true)
                await login(values)
                addToast({
                    title: 'Đăng nhập thành công',
                    color: 'success',
                })

                router.push(redirect)
            } catch (error) {
                addToast({
                    title: 'Đăng nhập thất bại',
                    description: `${error}`,
                    color: 'danger',
                })
            } finally {
                setLoading(false)
            }
        },
    })

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="min-w-[600px] shadow-lg rounded-sm py-8 p-16 bg-white"
        >
            <h1 className="text-2xl font-bold text-left font-saira">Sign in</h1>
            <p>
                to continue to{' '}
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
                    label="Email"
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
                    label="Password"
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
                    Support? Contact to{' '}
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
                        isLoading={isLoading}
                    >
                        Login
                    </Button>
                    <div className="flex items-center justify-between w-full gap-3">
                        <hr className="w-full opacity-20" />
                        <p className="my-5 opacity-70">or</p>
                        <hr className="w-full opacity-20" />
                    </div>
                    {/* <Button
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
