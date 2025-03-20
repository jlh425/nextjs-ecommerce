import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { number } from "zod";

export async function POST(
  req: Request,
  { params }: { params: { storeId: number } }
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

    const learningTypes = await prismadb.learningTypes.create({
      data: {
        id: label,
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(learningTypes);
  } catch (error) {
    console.log("[LEARNINGTYPES_POST]", error);
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

    const learningTypes = await prismadb.learningTypes.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(learningTypes);
  } catch (error) {
    console.log("[LEARNINGTYPES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
