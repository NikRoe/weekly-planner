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
    const { column } = request.body;

    await prisma.todo.update({
      where: { id: id as string },
      data: { column },
    });
    return response.status(200).json("Entry updated");
  }

  if (request.method === "PUT") {
    const { title, column, status, notes } = request.body;

    await prisma.todo.update({
      where: { id: id as string },
      data: { title, column, status, notes },
    });
    return response.status(200).json("Entry updated");
  }

  response.setHeader("Allow", ["GET", "PATCH", "PUT", "DELETE"]);
  response.status(405).end(`Method ${request.method} Not Allowed`);
}
