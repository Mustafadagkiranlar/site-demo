import { PrismaClient } from "@prisma/client";
import { type NextRequest } from "next/server";

const prisma = new PrismaClient();

//getting user information
export async function GET(request: NextRequest) {
  //getting username from query parameter
  const username = request.nextUrl.pathname.split("/").pop();

  //if username is not sent with query parameter
  if (!username) {
    return new Response(JSON.stringify({ result: "Missing Username" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    //finding the user with the given username
    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    //if user is not found in database
    if (!user) {
      return new Response(JSON.stringify({ result: `User Not Found.` }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    //success response
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    //error response
  } catch (error) {
    return new Response(
      JSON.stringify({ result: "Error getting the user", error: error }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

//updating user
export async function PUT(request: NextRequest) {
  //getting username from query parameter
  const username = request.nextUrl.pathname.split("/").pop();

  //getting user information sent from frontend
  const {
    full_name,
    email,
    DOB,
    biography,
    profile_pic,
    background_pic,
    city_id,
  } = await request.json();

  //checking user information validations
  if (!full_name || !username || !email || !city_id) {
    return new Response(JSON.stringify({ result: "Missing Credentials" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  //matching request information with db columns and update user with the given user_id
  try {
    await prisma.user.update({
      where: { username },
      data: {
        full_name: full_name,
        username: username,
        email: email,
        DOB: DOB,
        Biography: biography,
        profile_pic: profile_pic,
        background_pic: background_pic,
        city_id: city_id,
      },
    });
    //success response
    return new Response(JSON.stringify({ result: `Userupdated` }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    //error response
    return new Response(
      JSON.stringify({ result: "User not updated", error: error }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}