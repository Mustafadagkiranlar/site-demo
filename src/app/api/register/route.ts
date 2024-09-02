import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const saltRounds = 10;

export async function POST(request: Request) {
  const { full_name, password, username, email, DOB, city_id } =
    await request.json();

  if (!full_name || !password || !username || !email || !city_id) {
    return new Response(JSON.stringify({ result: "Missing Ceredentials" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const prisma = new PrismaClient();

  //hash password
  const hashPassword = await bcrypt.hash(password, saltRounds);

  //insert user
  try {
    await prisma.user.create({
      data: {
        full_name: full_name,
        password: hashPassword,
        username: username,
        email: email,
        DOB: new Date(), // need to be fixed
        city_id: city_id,
      },
    });

    return new Response(JSON.stringify({ result: "User created" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ result: "User cannot be created", error: error }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
