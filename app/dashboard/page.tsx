"use client"
import EarningsGraph from "@/components/EarningsGraph";
import { useRouter } from 'next/navigation'
import { useEffect } from "react";


export default function Dashboard() {
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <EarningsGraph />
    </div>
  );
}