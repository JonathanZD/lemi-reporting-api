import { NextApiRequest, NextApiResponse } from 'next'; 
import { PrismaClient } from '@prisma/client';
import { apiURL } from '../../../utils/constants/constants';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', apiURL);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight request
    return res.status(204).end();
  }

  if (req.method === 'POST') {
    const { name, description, reportedBy, reporterId } = req.body;

    // Default report object
    let body = {
      name,
      description,
      reportedBy,
      reportedByWeredaId: null,
      reportedByHiwasId: null,
      reportedByMDId: null,
    };

    let notificationData: any = {}; // Specify the type explicitly

    // Determine who is submitting the report
    switch (reportedBy) {
      case 'Hiwas':
        body.reportedByHiwasId = reporterId;
        notificationData = {
          message: 'A new report has been submitted by Hiwas.',
          recipientType: 'Hiwas',
          hiwasId: reporterId,
        };
        break;
      case 'Meseretawi':
        body.reportedByMDId = reporterId;
        notificationData = {
          message: 'A new report has been submitted by Meseretawi Dirijet.',
          recipientType: 'MeseretawiDirijet',
          meseretawiDirijetId: reporterId,
        };
        break;
      case 'Wereda':
        body.reportedByWeredaId = reporterId;
        notificationData = {
          message: 'A new report has been submitted by Wereda.',
          recipientType: 'Wereda',
          weredaId: reporterId,
        };
        break;
      default:
        return res.status(400).json({ error: 'Invalid reportedBy value' });
    }

    try {
      // Create the report
      const newReport = await prisma.report.create({
        data: body,
      });

      // Create the notification for the recipient
      await prisma.notification.create({
        data: notificationData as any, // Type assertion to fix TypeScript error
      });

      return res.status(201).json({
        message: 'Report created successfully, notification sent',
        data: newReport,
      });
    } catch (error) {
      console.error('Error creating report or notification:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  res.setHeader('Allow', ['POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
