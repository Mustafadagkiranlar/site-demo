import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { name } = await request.json();
  try {
      await prisma.cities.create({
      data: {
        name: name,
      },
    });

    return new Response(JSON.stringify({ result: "City Added" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ result: "City ERROR" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}