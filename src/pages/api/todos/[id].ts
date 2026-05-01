import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { id } = request.query;

  if (!id) {
    return response.status(404).json("Entry not found");
  }

  if (request.method === "GET") {
    const todo = await prisma.todo.findFirst({ where: { id: id as string } });
    return response.status(200).json(todo);
  }

  if (request.method === "DELETE") {
    await prisma.todo.delete({
      where: { id: id as string },
    });

    return response.status(200).json("Entry deleted");
  }

  if (request.method === "PATCH") {
    const { date } = request.body;

    await prisma.todo.update({
      where: { id: id as string },
      data: { date: date ?? null },
    });

    return response.status(200).json("Entry updated");
  }

  if (request.method === "PUT") {
    const { title, status, notes, category, time, date } = request.body;

    await prisma.todo.update({
      where: { id: id as string },
      data: { title, status, notes, category, time, date: date || null },
    });

    return response.status(200).json("Entry updated");
  }

  response.setHeader("Allow", ["GET", "PATCH", "PUT", "DELETE"]);
  response.status(405).end(`Method ${request.method} Not Allowed`);
}
