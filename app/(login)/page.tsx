"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import { cn } from "@/utils/cn";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const USER_ID = process.env.NEXT_PUBLIC_USER_ID;
    const USER_PASSWORD = process.env.NEXT_PUBLIC_USER_PASSWORD;
  

    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        const storedPassword = localStorage.getItem('userPassword');

        if (storedEmail === USER_ID && storedPassword === USER_PASSWORD) {
            router.push('/manualbill');
        }
    }, [router, USER_ID, USER_PASSWORD]);


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (email === USER_ID && password === USER_PASSWORD) {
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userPassword', password);
        router.push('/manualbill');
      } else {
        console.log('Invalid credentials');
      }
    };

  return (
    
    <div className="max-w-md w-full mx-auto rounded-2xl p-4 md:p-8 shadow-input ">
      <h2 className="font-bold text-xl  ">
          Welcome to IRCTS Login
      </h2>
      <p className=" text-sm max-w-sm mt-2 ">
          Log in to begin with bill generator options.
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="customermail@gmail.com"  value={email} onChange={(e) => setEmail(e.target.value)}  type="email" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password"  value={password}   onChange={(e) => setPassword(e.target.value)}/>
        </LabelInputContainer>
        <button

          className="bg-gradient-to-br relative group/btn from-zinc-900 to-zinc-900  block bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit">
          Login &rarr;
          <BottomGradient />
        </button>
        <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      </form>
    </div>
   
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
       {children}
    </div>
  );
};
