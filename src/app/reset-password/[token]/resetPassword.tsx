"use client"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useSession, signIn } from "next-auth/react"


const ResetPassword = ({params}: any) => {
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [user, setUser] = useState(null);

  const router = useRouter();
  const {data: session, status: sessionStatus}= useSession()

  // useEffect(()=>{

  // }, [params.token])

  console.log(params);
  

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

    if (!isEmailValid(email)) {
      setError("Email is Invalid")
      return
    }

    try {
        const res = await fetch('/api/forget-password',{
          method:'POST',
          headers:{
            "Content-Type": "application/json"
          },
          body:JSON.stringify({
            email,
          })
        })
  
        if(res.status === 400) setError(`Email: ${email}, Does Not Exist`)
        if(res.status === 200){
          setError("Email found");
          router.push("/login");
        }
      } catch (error) {
        setError("An Error Occured, Try Again");
        console.log(error);
        
      }



  }
  if (sessionStatus === "loading") {
    return <h1>Loading.....</h1>
  }

  return (
   sessionStatus !== "authenticated" && (
    <div className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className='p-8 rounded shadow-md w-96 bg-[#212121] '>
        <h1 className='text-white font-bold mb-4 text-center'>Forgot Password</h1>

        <form onSubmit={handleSubmit}  className='flex flex-col gap-4 items-center'>
          <input type="email" className='rounded p-1 pl-2 outline-none' placeholder='Input Email Address' required/>
          <button className='text-white font-bold bg-blue-600 hover:bg-blue-800 rounded px-3 p-1'>Submit</button>
          <p className='mb-4 text-red-600 text-[16px]'>{error && error}</p>
        </form>
        
        <div className='text-center text-gray-500'>- OR -</div>
      <Link href={'/login'} className='hover:text-blue-700 text-blue-400'>Login Here</Link>
      
      </div>
    </div>
    )
  )
}

export default ResetPassword
