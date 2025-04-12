import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { number } from "zod";

export async function POST(req: Request, { params }: { params: { storeId: bigint } }) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { type, description } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!type) {
      return new NextResponse("Type is required", { status: 400 });
    }    

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const taskSpecificity = await prismadb.taskSpecificity.create({
      data: {
        type: body.tpye, // Example value
        description: body.description || null, // Example value
        store: {
          connect: { id: params.storeId }, // Connect to the related store
        },
      },
    });

    return NextResponse.json(taskSpecificity);
  } catch (error) {
    console.log("[TASKSPECIFICITY_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: bigint } }) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const taskSpecificity = await prismadb.taskSpecificity.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(taskSpecificity);
  } catch (error) {
    console.log("[TASKSPECIFICITY_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
