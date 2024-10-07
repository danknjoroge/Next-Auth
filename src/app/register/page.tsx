import { Metadata } from 'next';
import React from 'react'
import Register from './register';

export const metadata: Metadata = {
  title: "Test App || Register",
  description: "Created a test app",
};

const Page = () => {
  return (
      <Register/>
  )
}

export default Page
