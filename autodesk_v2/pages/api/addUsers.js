import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { firstName, lastName, email, password } = req.body;

      const newUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password, // Hash before saving in production
          files: {
            create: [
              { name: "document.pdf", url: "https://example.com/document.pdf" },
              { name: "image.png", url: "https://example.com/image.png" },
            ],
          },
        },
      });

      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: "User creation failed", details: error });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}