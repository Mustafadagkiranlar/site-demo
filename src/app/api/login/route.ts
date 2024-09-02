import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";


export async function POST(request:Request) {
    const { username, password } = await request.json();

    if (!username || !password) {
        return new Response(JSON.stringify({ result: "Missing Ceredentials" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const prisma = new PrismaClient();

    //check if user exists
    const user = await prisma.user.findUnique({
        where: {
            username: username,
        },
    });

    if (!user) {
        return new Response(JSON.stringify({ result: "User not found" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    //check password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return new Response(JSON.stringify({ result: "Wrong password" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify({ result: "Login successful" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}