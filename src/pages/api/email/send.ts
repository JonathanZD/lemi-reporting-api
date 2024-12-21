// // pages/api/sendEmail.ts
// import type { NextApiRequest, NextApiResponse } from 'next'
// import nodemailer from 'nodemailer'
// import logo from '../../../assets/logo.png';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     const allowedOrigin = 'http://localhost:5173'; 

//     res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
//     res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
//     res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  
//     if (req.method === 'OPTIONS') {
//       res.setHeader('Access-Control-Max-Age', '86400'); 
//       return res.status(204).end();
//     }
//     if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' })
//   }

//   const { email } = req.body
//   console.log(email)
//   if (!email) {
//     return res.status(400).json({ message: 'Email is required' })
//   }
//   await prisma.userEmail.create({
//     data: { email }
//   });
//   const transporter = nodemailer.createTransport({
//     service: 'Gmail', 
//     auth: {
//         port: 587,
//         secure: false, 
//         user: "jonathanzeru21@gmail.com", 
//         pass: "isek dnxp xkms iiha"
//     },
//   })
//   console.log(transporter, "transporter")
  
//   const htmlContent = `
//   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
//     <div style="background-color: #897848; padding: 20px; text-align: center; color: white;">
//       <img src="${logo}" alt="Logo" style="max-width: 150px; margin-bottom: 10px;">
//       <h1>Welcome to Our Community!</h1>
//       <p>Thank you for subscribing to our updates!</p>
//     </div>
//     <img src="${logo}" alt="Banner Image" style="width: 100%; height: auto;">
//     <div style="padding: 20px; color: #333;">
//       <p style="font-size: 16px;">Dear Subscriber,</p>
//       <p style="font-size: 16px;">We’re excited to have you join us! Get ready to stay updated on our latest news, exclusive events, and special offers designed just for you.</p>
//       <p style="font-size: 16px;">If you have any questions, feel free to reach out to our support team at <a href="mailto:support@example.com" style="color: #4A90E2; text-decoration: none;">support@example.com</a>.</p>
//     </div>
//     <img src="${logo}" alt="Footer Banner" style="width: 100%; height: auto;">
//     <div style="background-color: #897848; color: white; text-align: center; padding: 10px;">
//       <p style="margin: 0;">&copy; 2023 Your Company. All rights reserved.</p>
//     </div>
//   </div>
// `;
//   const mailOptions = {
//     from: "jonathanzeru21@gmail.com",
//     to: email,
//     subject: 'Welcome to Our Community!',
//     html: htmlContent
//   }
//   console.log(mailOptions, "mailOptions")

//   try {
//     await transporter.sendMail(mailOptions)
//     res.status(200).json({ message: 'Email sent successfully' })
//   } catch (error) {
//     console.error('Error sending email:', error)
//     res.status(500).json({ message: 'Failed to send email' })
//   }
// }
