import User from '@/models/User';
import dbConnect from '@/lib/db';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';


export const POST = async (request:any)=>{
    const {email, password} = await request.json();
    await dbConnect();

    const emailExist = await User.findOne({email});
    if(emailExist){
        return new NextResponse("Email Already Exist.", {status:400})
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    const newUser = new User({
        email,
        password:hashedPassword
    })

    try {
        await newUser.save();
        return new NextResponse ("User Registered Successfully.", {status:200})
    } catch (error:any) {
        return new NextResponse(error, {
            status:500
        })
    }
}