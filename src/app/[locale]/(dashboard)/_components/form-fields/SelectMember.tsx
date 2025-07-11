'use client'

import React, { useEffect, useState } from 'react'

import { Image, Select } from 'antd'
import { FormikProps } from 'formik'

import { supabase } from '@/lib/supabase/client'
import { User } from '@/validationSchemas/auth.schema'
import { NewProject } from '@/validationSchemas/project.schema'

type Props = {
    form: FormikProps<NewProject>
}
export default function SelectMember({ form }: Props) {
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        const fetchAllUsers = async () => {
            const { data: allUsers } = await supabase.from('User').select()
            setUsers(allUsers!)
        }
        fetchAllUsers()
    }, [])

    return (
        <Select
            options={users?.map((usr) => {
                return { ...usr, label: usr.name!, value: usr.id! }
            })}
            placeholder="Select one or more member"
            size="large"
            optionRender={(opt) => {
                return (
                    <div className="flex items-center justify-start gap-4">
                        <div className="size-12">
                            <Image
                                src={opt.data.avatar!}
                                alt={opt.data.name}
                                className="size-full rounded-full object-cover"
                            />
                        </div>
                        <p className="font-normal">{opt.data.name}</p>
                    </div>
                )
            }}
            styles={{}}
            mode="multiple"
            onChange={(value) => {
                form.setFieldValue('memberAssignIds', value)
            }}
            value={form.values.memberAssignIds}
        />
    )
}
