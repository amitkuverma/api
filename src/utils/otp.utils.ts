import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Generate a random 6-digit OTP
export const generateOtp = (): string => {
    return crypto.randomInt(100000, 999999).toString();
};

// Send OTP via email
export const sendOtp = async (email: string, otp: string): Promise<void> => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Example, adjust as needed
        host: 'smtp.gmail.com',
        port: 465, // Change to 587 if needed
        secure: true, // Use TLS (secure: false for 587 or 25)
        auth: {
            user: 'gorkhacoin@gmail.com',
            pass: 'emzc sjow nnra isxx',
        },
        connectionTimeout: 5000,
    });

    const mailOptions = {
        from: 'gorkhacoin@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
};
