import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { apiURL } from '../../../utils/constants/constants';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    res.setHeader('Access-Control-Allow-Origin', apiURL);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight request
        return res.status(204).end();
    }
    if (req.method === 'POST') {
        const { firstName,
            lastName,
            email,
            phone,
            userName,
            password,
            role,
            isActive, type,mdId } = req.body;

        try {
            switch (type) {
                case "Wana":
                    const wana = await prisma.wana.create({
                        data: {
                            firstName,
                            lastName,
                            email,
                            phone,
                            userName,
                            password,
                            role,
                            isActive
                        }
                    });
                    return res.status(201).json({ message: 'Wana created successfully', data: wana });
                case "Meseretawi":
                    const newMeseretawi = await prisma.meseretawiDirijet.create({
                        data: {
                            firstName,
                            lastName,
                            email,
                            phone,
                            userName,
                            password,
                            role,
                            isActive
                        }
                    });
                    return res.status(201).json({ message: 'Meseretawi created successfully', data: newMeseretawi });
                case "Wereda":
                    const wereda = await prisma.wereda.create({
                        data: {
                            firstName,
                            lastName,
                            email,
                            phone,
                            userName,
                            password,
                            role,
                            isActive
                        }
                    });
                    return res.status(201).json({ message: 'Wereda created successfully', data: wereda });
                case "Hiwas":
                    const hiwas = await prisma.hiwas.create({
                        data: {
                            firstName,
                            lastName,
                            email,
                            phone,
                            userName,
                            password,
                            role,
                            isActive,
                            mdId
                        }
                    });
                    return res.status(201).json({ message: 'Hiwas created successfully', data: hiwas });

            }

        } catch (error) {
            console.error('Error creating user:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}
