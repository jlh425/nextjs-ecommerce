import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { aimodelId: number } }
) {
  try {
    if (!params.aimodelId) {
      return new NextResponse("aimodel id is required", { status: 400 });
    }

    const aimodel = await prismadb.AIModel.findUnique({
      where: {
        id: params.aimodelId,
      },
      include: {
        billboard: true,
      },
    });

    return NextResponse.json(aimodel);
  } catch (error) {
    console.log("[aimodel_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { aimodelId: number; storeId: number } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.aimodelId) {
      return new NextResponse("aimodel id is required", { status: 400 });
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

    const aimodel = await prismadb.AIModel.delete({
      where: {
        id: params.aimodelId,
      },
    });

    return NextResponse.json(aimodel);
  } catch (error) {
    console.log("[aimodel_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { aimodelId: number; storeId: number } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, billboardId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.aimodelId) {
      return new NextResponse("aimodel id is required", { status: 400 });
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

    const aimodel = await prismadb.AIModel.update({
      where: {
        id: params.aimodelId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return NextResponse.json(aimodel);
  } catch (error) {
    console.log("[AIMODEL_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
