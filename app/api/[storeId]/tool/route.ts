import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function POST(
  req: Request,
  { params }: { params: { storeId: number } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, description } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!description) {
      return new NextResponse("description is required", { status: 400 });
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

    const tool = await prismadb.tool.create({
      data: {
        name,
        description,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(tool);
  } catch (error) {
    console.log("[TOOLS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: number } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const tools = await prismadb.tool.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(tools);
  } catch (error) {
    console.log("[TOOLS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
