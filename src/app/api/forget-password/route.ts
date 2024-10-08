import User from '@/models/User';
import dbConnect from '@/lib/db';
import { NextResponse } from 'next/server';
import crypto from "crypto";
const nodemailer = require('nodemailer');


const provider = process.env.NEXT_PUBLIC_EMAIL_PROVIDER; //set the email provider to either 'outlook' or 'gmail'
const username = process.env.NEXT_PUBLIC_BURNER_USERNAME;
const password = process.env.NEXT_PUBLIC_BURNER_PASSWORD;
const myEmail = process.env.NEXT_PUBLIC_PERSONAL_EMAIL;

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
    
    const transporterConfig = provider === 'gmail' ? {
        service: 'gmail',
        auth: {
            user: username,
            pass: password
        }
    } : {
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: false, // use TLS
        tls: {
            ciphers: "SSLv3",
            rejectUnauthorized: false,
        },
        auth: {
            user: username,
            pass: password
        }
    };


    const transporter = nodemailer.createTransport(transporterConfig);

    // const message ={
    //     to:email,
    //     from:'dan@gmail.com',
    //     subject:"Reset Password", 
    //     text:body
    // }
    
    try {
        const mail = await transporter.sendMail({
            from: username,
            to: email,
            replyTo: email,
            subject: `Reset Password`,
            html: `
                <p>Hi,</p>
                <p>Please use the below link to reset your password.</p>
                <h4>${reserUrl}</h4>
               
            `,
        });
        await emailExist.save();
        return NextResponse.json({ message: "Reset Password Email Sent to Your Email" }, {status:200});
    } catch (error) {
        console.log(error);
        emailExist.resetToken = undefined;
        emailExist.resetTokenExpiry = undefined;
        await emailExist.save();
        return NextResponse.json({ message: "Failed to Send The Email." }, { status: 500 });
    }



     
    
}