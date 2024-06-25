"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DynamicForm from '@/components/DynamicForm'


const ManualPage = () => {
  const router = useRouter()

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail')
    const userPassword = localStorage.getItem('userPassword')

    const ENV_USER_EMAIL = process.env.NEXT_PUBLIC_USER_ID
    const ENV_USER_PASSWORD = process.env.NEXT_PUBLIC_USER_PASSWORD

    if (userEmail !== ENV_USER_EMAIL || userPassword !== ENV_USER_PASSWORD) {
      router.push('/')
    }
  }, [router])

  return (
    <>
      <DynamicForm />
    </>
            
  )
}

export default ManualPage