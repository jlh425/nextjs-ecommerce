import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { learningTypesId: number } }
) {
  try {
    if (!params.learningTypesId) {
      return new NextResponse("learningTypes id is required", { status: 400 });
    }

    const learningTypes = await prismadb.learningTypes.findUnique({
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
  { params }: { params: { learningTypesId: number; storeId: number } }
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

    const learningTypes = await prismadb.learningTypes.delete({
      where: {
        id: params.learningTypesId,
      },
    });

    return NextResponse.json(learningTypes);
  } catch (error) {
    console.log("[LEARNINGTYPES]_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { learningTypesId: number; storeId: number } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
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

    const learningTypes = await prismadb.learningTypes.update({
      where: {
        id: params.learningTypesId,
      },
      data: {
        label,
        imageUrl,
      },
    });

    return NextResponse.json(learningTypes);
  } catch (error) {
    console.log("[LEARNINGTYPES_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
