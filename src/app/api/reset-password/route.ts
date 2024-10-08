import User from '@/models/User';
import dbConnect from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';


export const POST = async (request:any)=>{
    const {password, email} = await request.json();
    await dbConnect();

    const userExist = await User.findOne({email});
    const hashedPassword = await bcrypt.hash(password, 5);
    userExist.password = hashedPassword;
    
    userExist.resetToken = undefined;
    userExist.resetTokenExpiry = undefined;

    try {
        await userExist.save();
        return new NextResponse("Users Password Updated.", {status:200});

    } catch (error:any) {
        return new NextResponse(error, {status: 500});
    }

}