import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(req: Request, { params }: { params: { toolId: bigint } }) {
  try {
    if (!params.toolId) {
      return new NextResponse("Tool id is required", { status: 400 });
    }

    const tool = await prismadb.tool.findUnique({
      where: {
        id: params.toolId,
      },
    });

    return NextResponse.json(tool);
  } catch (error) {
    console.log("[TOOL_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { toolId: bigint; storeId: bigint } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.toolId) {
      return new NextResponse("Tool id is required", { status: 400 });
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

    const tool = await prismadb.tool.delete({
      where: {
        id: params.toolId,
      },
    });

    return NextResponse.json(tool);
  } catch (error) {
    console.log("[TOOL_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { toolId: bigint; storeId: bigint } }
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
      return new NextResponse("Description is required", { status: 400 });
    }

    if (!params.toolId) {
      return new NextResponse("tool id is required", { status: 400 });
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

    const tool = await prismadb.tool.update({
      where: {
        id: params.toolId,
      },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(tool);
  } catch (error) {
    console.log("[TOOL_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
