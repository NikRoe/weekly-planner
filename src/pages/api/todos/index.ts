import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === "GET") {
    const todos = await prisma.todo.findMany();
    return response.status(200).json(todos);
  }

  if (request.method === "POST") {
    const { title, date, status, notes, category, time } = request.body;

    const newTodo = await prisma.todo.create({
      data: {
        title,
        status: status ?? "Open",
        notes,
        category,
        time,
        date: date || null,
      },
    });

    return response.status(201).json(newTodo);
  }

  if (request.method === "PATCH") {
    await prisma.todo.updateMany({ data: { status: "Open" } });

    return response.status(200).json("Todos updated successfully");
  }

  response.setHeader("Allow", ["GET", "POST", "PATCH"]);
  response.status(405).end(`Method ${request.method} Not Allowed`);
}
