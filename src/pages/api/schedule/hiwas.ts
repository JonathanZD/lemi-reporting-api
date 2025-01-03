import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { apiURL } from '../../../utils/constants/constants';
import { IncomingForm, File as FormidableFile } from 'formidable';


// Initialize Prisma Client
const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', apiURL);
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight request
    return res.status(204).end();
  } 
   if (req.method === 'GET') {
    const { hiwasId } = req.query;

    if (hiwasId) {
      try {
        const job = await prisma.schedule.findMany({
          where: { createdByHiwasId: Number(hiwasId) },
          include:{
            createdByHiwas: true,
            createdByMD: true,
            createdByWana: true,
            createdByWereda: true,
          }
        });

        if (!job) {
          return res.status(404).json({ error: 'hiwas not found' });
        }

        return res.status(200).json(job);
      } catch (error) {
        console.error('Error retrieving hiwas:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    } 
  }
  if (req.method === 'POST') {
    const form = new IncomingForm({ keepExtensions: true, multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form data:', err);
        return res.status(500).json({ error: 'Failed to process form data' });
      }
      const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
      const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
      const startTime = Array.isArray(fields.startTime) ? fields.startTime[0] : fields.startTime;
      const endTime = Array.isArray(fields.endTime) ? fields.endTime[0] : fields.endTime;
      const creatorId = Array.isArray(fields.creatorId) ? fields.creatorId[0] : fields.creatorId;
    try {
      // Create the schedule  
      console.log(fields)    
      const newSchedule = await prisma.schedule.create({
        data: {
          title,
          description,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          createdByRole: 'Hiwas',
          createdByHiwasId: Number(creatorId),
          createdById: Number(creatorId),
          status: "To Do"
        },
      });
      console.log(newSchedule)

      // Get the MeseretawiDirijet related to the Hiwas
      const hiwas = await prisma.hiwas.findUnique({
        where: { id: Number(creatorId) },
        include: { md: true }
      });
      console.log(hiwas)

      // Send notification to the related MeseretawiDirijet
      if (hiwas?.md) {
        console.log(hiwas?.md)
       const hiwass = await prisma.notification.create({
          data: {
            message: `New schedule created: ${title}`,
            recipientType: 'MeseretawiDirijet',
            meseretawiDirijetId: hiwas.md.id,
          },
        });
        console.log(hiwass)
      }

      return res.status(201).json({
        message: 'Schedule created successfully, notification sent',
        data: newSchedule,
      });
    } catch (error) {
      console.error('Error creating schedule or notification:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  }else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
