"use client"
import React from 'react';
import Link from 'next/link';
import {signOut, useSession } from 'next-auth/react';

const Navbar = () => {
  const {data:session} = useSession();
  return (
    <div>
       <ul className='flex justify-between m-10 items-center'>
           <div >
                <Link href={'/'}>Home</Link>
            </div>

            <div className='flex gap-4'>
            <Link href={'/dashboard'}>Dashboard</Link>
            {!session ?(
            <>
            <Link href={'/login'}>Login</Link>
            <Link href={'/register'}>Sign Up</Link>

            </>): (
              <>
              <p>{session?.user?.email}</p>
              <button onClick={()=> signOut()}>Sign Out</button>
              </>
            ) }
            
            </div> 
            
       </ul>
    </div>
  )
}

export default Navbar
