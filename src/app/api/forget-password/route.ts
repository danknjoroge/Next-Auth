import User from '@/models/User';
import dbConnect from '@/lib/db';
import { NextResponse } from 'next/server';
import crypto from "crypto"



export const POST = async (request:any)=>{
    const {email} = await request.json();
    await dbConnect();

    const emailExist = await User.findOne({email});

    if(!emailExist){
        return new NextResponse("Email Does Not Exist", {status:400})
    }

    const resetToken = crypto.randomBytes(20).toString("hex")
    const passwordResetToken =  crypto.createHash("sha256").update(resetToken).digest("hex");

    const passwordResetExpires = Date.now() + 3600000;

    emailExist.resetToken = passwordResetToken;
    emailExist.resetTokenExpiry = passwordResetExpires;
    const reserUrl =`localhost:3000/reset-password/${resetToken}`;

    console.log(reserUrl);
    const body = "Reset your password by clicking the following link" + reserUrl;

    const message ={
        to:email,
        from:'dan@gmail.com',
        subject:"Reset Password", 
        text:body
    }
    

}