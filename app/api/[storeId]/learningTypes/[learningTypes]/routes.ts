import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { learningTypesId: bigint } }
) {
  try {
    if (!params.learningTypesId) {
      return new NextResponse("learningTypes id is required", { status: 400 });
    }

    const learningTypes = await prismadb.learningType.findUnique({
      where: {
        id: params.learningTypesId,
      },
    });

    return NextResponse.json(learningTypes);
  } catch (error) {
    console.log("[BILLBOARD_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { learningTypesId: bigint; storeId: bigint } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.learningTypesId) {
      return new NextResponse("learningTypes id is required", { status: 400 });
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

    const learningTypes = await prismadb.learningType.delete({
      where: {
        id: params.learningTypesId,
      },
    });

    return NextResponse.json(learningTypes);
  } catch (error) {
    console.log("[LEARNINGTYPES_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { learningTypesId:bigint; storeId:bigint } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { type, description } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!type) {
      return new NextResponse("type is required", { status: 400 });
    }

    if (!params.learningTypesId) {
      return new NextResponse("learningTypes id is required", { status: 400 });
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

    const learningTypes = await prismadb.learningType.update({
      where: {
        id: params.learningTypesId,
      },
      data: {
        type,
        description
      },
    });

    return NextResponse.json(learningTypes);
  } catch (error) {
    console.log("[LEARNINGTYPES_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
