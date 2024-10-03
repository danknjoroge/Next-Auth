"use client"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useSession, signIn } from "next-auth/react"


const Login = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const {data: session, status: sessionStatus}= useSession()

  useEffect(()=>{
    if(sessionStatus === "authenticated"){
      router.replace("/dashboard")
    }
  },[sessionStatus,router])


  const isEmailValid =(email:string)=>{
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return regex.test(email);
  }

  const handleSubmit=async (e:any)=>{
    e.preventDefault();

    const email = e.target[0].value;
    const password =e.target[1].value;

    if (!isEmailValid(email)) {
      setError("Email is Invalid")
      return
    }

    if (!password || password.length < 8) {
      setError("Password Must be at least 8 Characters")
      return;
    }

    const res = await signIn("credentials", {
      redirect:false,
      email,
      password
    })

    if (res?.error) {
      setError("Invalid Email or Password");
      if (res.url) router.replace("/dashboard")
    }else{
      setError("")
    }

  }
  if (sessionStatus === "loading") {
    return <h1>Loading.....</h1>
  }

  return (
   sessionStatus !== "authenticated" && (
    <div className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className='p-8 rounded shadow-md w-96 bg-[#212121] '>
        <h1 className='text-white font-bold mb-4 text-center'>LOGIN</h1>

        <form onSubmit={handleSubmit}  className='flex flex-col gap-4 items-center'>
          <input type="email" className='rounded p-1 pl-2 outline-none' placeholder='Email' required/>
          <input type="password"  className='rounded p-1 pl-2 outline-none' placeholder='Password' required/>

          <button className='text-white font-bold bg-blue-600 hover:bg-blue-800 rounded px-3 p-1'>Login</button>
          <p className='mb-4 text-red-600 text-[16px]'>{error && error}</p>
        </form>
        <button onClick={()=>signIn("github")}>Login With Github</button>
        <div className='text-center text-gray-500'>- OR -</div>
      <Link href={'/register'} className='hover:text-blue-700 text-blue-400'>Dont have Account? Register!</Link>
      
      </div>
    </div>
    )
  )
}

export default Login
