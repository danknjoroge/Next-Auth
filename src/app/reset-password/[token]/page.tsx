"use client"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useSession, signIn } from "next-auth/react"


const ResetPassword = ({params}: any) => {
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [user, setUser] = useState<null>(null);
  const router = useRouter();
  const {data: session, status: sessionStatus}= useSession();
  

  useEffect(()=>{
    const verifyToken =async ()=>{
      try {
        const res = await fetch('/api/verify-token',{
          method:'POST',
          headers:{
            "Content-Type": "application/json"
          },
          body:JSON.stringify({
            token:params.token,
          })
        })
  
        if(res.status === 400) {
          setError(`Invalid Token or Has Expired`);
          setVerified(true)
        }

        if(res.status === 200){
          setError("");
          setVerified(true);
          const userData = await res.json();
          setUser(userData)
          // router.push("/login");
        }
      } catch (error) {
        setError("An Error Occured, Try Again");
        
      }
    }

    verifyToken()
  }, [params.token])

  console.log(user);
  
  useEffect(()=>{
    if(sessionStatus === "authenticated"){
      router.replace("/dashboard")
    }
  },[sessionStatus,router]);

  const handleSubmit=async (e:any)=>{
    e.preventDefault();
    const password = e.target[0].value;


    try {
        const res = await fetch('/api/reset-password',{
          method:'POST',
          headers:{
            "Content-Type": "application/json"
          },
          body:JSON.stringify({
            password,
            email: user!.email
          })
        })
  
        if(res.status === 400) setError(`Something Went Wrong, Try Again.`)
        if(res.status === 200){
          setError("");
          router.push("/login");
        }
      } catch (error) {
        setError("An Error Occured, Try Again");
        console.log(error);
        
      }



  }
  if (sessionStatus === "loading" || !verified) {
    return <h1>Loading.....</h1>
  }

  return (
   sessionStatus !== "authenticated" && (
    <div className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className='p-8 rounded shadow-md w-96 bg-[#212121] '>
        <h1 className='text-white font-bold mb-4 text-center'>Reset Password</h1>

        <form onSubmit={handleSubmit}  className='flex flex-col gap-4 items-center'>
          <input type="password" className='rounded p-1 pl-2 outline-none' placeholder='Input Reset Password' required/>
          <button
          disabled={error.length > 0}
           className='text-white font-bold bg-blue-600 hover:bg-blue-800 rounded px-3 p-1'>Reset Password</button>
          <p className='mb-4 text-red-600 text-[16px]'>{error && error}</p>
        </form>
        
      </div>
    </div>
    )
  )
}

export default ResetPassword
