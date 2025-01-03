"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const Page = () => {
  const router = useRouter();
  useEffect(()=>{
    router.push("/auth/signin")
  },[])
  return (
    <div className="h-screen w-full bg-black text-white grid place-items-center">
      Welcome!
    </div>
  )
}

export default Page
