"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/router';


const USER_ID = process.env.NEXT_PUBLIC_USER_ID;
const USER_PASSWORD = process.env.NEXT_PUBLIC_USER_PASSWORD;

export const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    const userPassword = localStorage.getItem('userPassword');

    if (!userEmail || !userPassword || userEmail !== USER_ID || userPassword !== USER_PASSWORD) {
      router.push('/login');
    }
  }, [router]);
};