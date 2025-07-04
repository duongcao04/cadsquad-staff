'use client'

import React, { useState } from 'react'

import { Button, Input, addToast } from '@heroui/react'
import { useFormik } from 'formik'
import { Eye, EyeOff } from 'lucide-react'

import envConfig from '@/config/envConfig'
import { Link, useRouter } from '@/i18n/navigation'
import { setSession } from '@/lib/auth/session'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/zustand/useAuthStore'
import { useSearchParam } from '@/shared/hooks/useSearchParam'
import { LoginSchema, User } from '@/validationSchemas/auth.schema'

const HOME = envConfig.NEXT_PUBLIC_URL as string

export default function LoginForm() {
    const router = useRouter()
    const { getSearchParam } = useSearchParam()
    const redirect = getSearchParam('redirect') ?? '/'

    const [isVisible, setIsVisible] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const toggleVisibility = () => setIsVisible(!isVisible)

    const { setAuthUser } = useAuthStore()

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: LoginSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true)
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: values.email,
                    password: values.password,
                })

                if (error || !data.session) {
                    throw new Error(`${error?.message}`)
                }

                if (data.session) {
                    setSession(data.session.user as User)
                    const { data: userInf } = await supabase
                        .from('User')
                        .select()
                        .eq('id', data.user.id)
                        .maybeSingle()
                    setAuthUser(userInf as User)

                    addToast({
                        title: 'Sign in successfully!',
                        color: 'success',
                    })
                    router.push(redirect)
                }
            } catch (error) {
                addToast({
                    title: 'Sign in failed!',
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
            <h1 className="text-2xl font-bold font-saira text-left">Sign in</h1>
            <p>
                to continue to{' '}
                <Link
                    href={HOME}
                    className="hover:underline text-blue-700 underline-offset-2"
                >
                    staff.csdvietnam.com
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
                        className="hover:underline text-blue-700 underline-offset-2"
                    >
                        Ch.duong@cadsquad.vn
                    </Link>
                </p>
                <div className="mt-10 w-full grid place-items-center">
                    <Button
                        color="danger"
                        className="w-[80%] rounded-sm"
                        type="submit"
                        isLoading={isLoading}
                    >
                        Login
                    </Button>
                </div>
            </div>
        </form>
    )
}
