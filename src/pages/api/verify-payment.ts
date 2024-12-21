// import { NextApiRequest, NextApiResponse } from 'next';
// import { Chapa } from 'chapa-nodejs';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();
// const chapa = new Chapa({
//   secretKey: 'CHASECK_TEST-z21il8vpLmxjGUgNwJNvWuog4B8ne1jd',
// });

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { tx_ref, paymentData } = req.query;

//   // Ensure tx_ref and paymentData are present
//   if (!tx_ref || typeof tx_ref !== 'string') {
//     return res.status(400).json({ message: 'Transaction reference is required' });
//   }
//   if (!paymentData || typeof paymentData !== 'string') {
//     return res.status(400).json({ message: 'Payment data is required' });
//   }

//   try {
//     // Check if the transaction reference already exists in the donation table
//     const existingDonation = await prisma.donation.findUnique({
//       where: { tx_ref },
//     });

//     if (existingDonation) {
//       // 
//       console.log("If donation already exists, return a success message");
//       return res.status(200).json({
//         message: 'Donation already successful',
//         donation: existingDonation,
//         response: {status: 'Donation already successful'}
//       });
//     }

//     // Verify payment with Chapa
//     const chapaResponse = await chapa.verify({ tx_ref });

//     if (chapaResponse.status !== 'success') {
//       console.log("Payment verification failed ", chapaResponse);
//       return res.status(400).json({ message: 'Payment verification failed', chapaResponse });
//     }

//     // Decode and parse the paymentData
//     const decodedPaymentData = JSON.parse(decodeURIComponent(paymentData as string));
//     const { name, phone, city, country, email, amount, imagePath } = decodedPaymentData;

//     // Create a new donation record
//     const donation = await prisma.donation.create({
//       data: {
//         name: String(name),
//         phone: String(phone),
//         city: String(city),
//         country: String(country),
//         email: String(email),
//         type: 'One-Time', // Assuming donation type is 'One-Time'
//         hasPaid: true,
//         amount: parseFloat(String(amount)), // Convert amount to a number
//         image: String(imagePath), // The image path
//         link: "", // You can add a relevant link if needed
//         tx_ref,
//       },
//     });

//     // Return success response after donation creation
//     return res.status(200).json({
//       message: 'Payment verified successfully and donation created',
//       donation,
//       response: chapaResponse
//     });

//   } catch (error) {
//     console.error('Error verifying payment:', error);
//     return res.status(500).json({ message: 'Error verifying payment', error });
//   }
// }
