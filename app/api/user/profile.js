// /pages/api/user/profile.js
import { verify } from 'jsonwebtoken';
import prisma from '@/lib/prisma'; // or your db connection

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        bio: true,
        // add anything else you want to show
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);

  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
}
