import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { apiURL } from '../../../utils/constants/constants';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', apiURL);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(204).end();
  }

  if (req.method === 'POST') {
    const { title, description, startTime, endTime, creatorId } = req.body;

    try {
      // Step 1: Create the schedule
      const newSchedule = await prisma.schedule.create({
        data: {
          title,
          description,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          createdByRole: 'MeseretawiDirijet',
          createdByMDId: creatorId,
          createdById: creatorId
        },
      });

      // Step 2: Retrieve all Hiwas under the MeseretawiDirijet
      const hiwasList = await prisma.hiwas.findMany({
        where: {
          mdId: creatorId,
        },
      });

      // Step 3: Create notifications for all Hiwas
      const notifications = hiwasList.map((hiwas) => ({
        message: `A new schedule has been created: ${title}`,
        recipientId: hiwas.id,
        recipientType: 'Hiwas',
        hiwasId: hiwas.id,
        isRead: false,
      }));

      await prisma.notification.createMany({
        data: notifications,
      });

      return res.status(201).json({
        message: 'Schedule created successfully, notifications sent to all Hiwas',
        data: newSchedule,
      });
    } catch (error) {
      console.error('Error creating schedule or notifications:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  res.setHeader('Allow', ['POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
