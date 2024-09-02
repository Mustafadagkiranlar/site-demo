import { PrismaClient } from "@prisma/client";
import { type NextRequest } from "next/server";

const prisma = new PrismaClient();

//Getting post_id from query parameter. Policy is needed for security
export async function GET(request: NextRequest) {
  const post_id = request.nextUrl.pathname.split("/").pop();

  //checking if post_id is sent or not
  if (!post_id) {
    return new Response(JSON.stringify({ result: "Missing Post ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    //finding post with the sent post_id
    const post = await prisma.post.findUnique({
      where: { id: Number(post_id) },
    });

    //if post is not in database
    if (!post) {
      return new Response(JSON.stringify({ result: `Post Not Found.` }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    //if post is found
    return new Response(JSON.stringify(post), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    //error response
    return new Response(
      JSON.stringify({ result: "Error getting the post", error: error }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(request: Request) {
  //getting post information
  const { user_id, description, image, location } = await request.json();

  //checking post information validation
  if (!user_id || !description) {
    return new Response(JSON.stringify({ result: "Missing Ceredentials" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    //matching post information and creating post for the given user_id
    await prisma.post.create({
      data: {
        user_id: user_id,
        description: description,
        image: image,
        location: location,
      },
    });
    //success response
    return new Response(JSON.stringify({ result: "Post Created" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    //error response
    return new Response(
      JSON.stringify({ result: "Post not created", error: error }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function PUT(request: NextRequest) {
  //getting post id
  const post_id = request.nextUrl.pathname.split("/").pop();

  //getting post_information
  const { description, image, location } = await request.json();

  //checking validation of post information
  if (!post_id || !description) {
    return new Response(JSON.stringify({ result: "Missing Credentials" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    //matching the post information and updating for the given post_id
    await prisma.post.update({
      where: { id: Number(post_id) },
      data: {
        description: description,
        image: image,
        location: location,
      },
    });
    //Success response
    return new Response(JSON.stringify({ result: `Post Updated;` }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    //Error response
    return new Response(
      JSON.stringify({ result: "Post not updated", error: error }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

//deleting post with the id
//this may be not deleted permanently, may be soft-deleted and use hidden to store it in database for any security issues (police, etc..)
export async function DELETE(request: NextRequest) {
  const post_id = request.nextUrl.pathname.split("/").pop();

  if (!post_id) {
    return new Response(JSON.stringify({ result: "Post Couldn't Be Found" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  //deleting post with the given post_id
  try {
    await prisma.post.delete({
      where: { id: Number(post_id) },
    });
    //success
    return new Response(JSON.stringify({ result: `Post Deleted;` }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    //error
    return new Response(
      JSON.stringify({ result: "Post not deleted", error: error }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}