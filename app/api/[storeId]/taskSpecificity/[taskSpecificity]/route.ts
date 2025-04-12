import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { taskSpecificityId: bigint } }
) {
  try {
    if (!params.taskSpecificityId) {
      return new NextResponse("taskSpecificities id is required", {
        status: 400,
      });
    }

    const taskSpecificity = await prismadb.taskSpecificity.findUnique({
      where: {
        id: params.taskSpecificityId,
      },
    });

    return NextResponse.json(taskSpecificity);
  } catch (error) {
    console.log("[TASKSPECIFICITY_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { taskSpecificityId: bigint; storeId: bigint } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.taskSpecificityId) {
      return new NextResponse("taskSpecificity id is required", {
        status: 400,
      });
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

    const taskSpecificity = await prismadb.taskSpecificity.delete({
      where: {
        id: params.taskSpecificityId,
      },
    });

    return NextResponse.json(taskSpecificity);
  } catch (error) {
    console.log("[TASKSPECIFICITY_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { taskSpecificityId: bigint; storeId: bigint } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { type, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!type) {
      return new NextResponse("Type is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
    }

    if (!params.taskSpecificityId) {
      return new NextResponse("taskSpecificity id is required", {
        status: 400,
      });
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

    const taskSpecificity = await prismadb.taskSpecificity.update({
      where: {
        id: params.taskSpecificityId,
      },
      data: {
        type,
        description: body.description || null,
        
      },
    });

    return NextResponse.json(taskSpecificity);
  } catch (error) {
    console.log("[TASKSPECIFICITY_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
