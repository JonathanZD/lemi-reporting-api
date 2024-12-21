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
      // Create the schedule
      const newSchedule = await prisma.schedule.create({
        data: {
          title,
          description,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          createdByRole: 'Hiwas',
          createdByHiwasId: creatorId,
          createdById: creatorId
        },
      });

      // Get the MeseretawiDirijet related to the Hiwas
      const hiwas = await prisma.hiwas.findUnique({
        where: { id: creatorId },
        include: { md: true }
      });

      // Send notification to the related MeseretawiDirijet
      if (hiwas?.md) {
        await prisma.notification.create({
          data: {
            message: `New schedule created: ${title}`,
            recipientType: 'MeseretawiDirijet',
            meseretawiDirijetId: hiwas.md.id,
          },
        });
      }

      return res.status(201).json({
        message: 'Schedule created successfully, notification sent',
        data: newSchedule,
      });
    } catch (error) {
      console.error('Error creating schedule or notification:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  res.setHeader('Allow', ['POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
