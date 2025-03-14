import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { name, url, userId } = req.body;
      const file = await prisma.file.create({
        data: { name, url, userId: parseInt(userId) },
      });
      return res.status(201).json(file);
    } catch (error) {
      return res.status(500).json({ error: "Failed to upload file" });
    }
  }

  if (req.method === "GET") {
    try {
      const files = await prisma.file.findMany();
      return res.status(200).json(files);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch files" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}