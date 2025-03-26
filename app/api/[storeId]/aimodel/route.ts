import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';
import { number } from 'zod';
 
export async function POST(req: Request, { params }: { params: { storeId: number } }) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const {
      name,
      description,
      price,
      isFeatured,
      isArchived,
      learningTypeId,
      taskSpecificityId,
      processingTypeId,
      sizeId,
      billboardId,
      categoryId
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!learningTypeId) {
      return new NextResponse("Learning Type ID is required", { status: 400 });
    }

    if (!taskSpecificityId) {
      return new NextResponse("Task Specificity ID is required", { status: 400 });
    }

    if (!processingTypeId) {
      return new NextResponse("Processing Type ID is required", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Size ID is required", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
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

    const aiModel = await prismadb.aIModel.create({
      data: {
        name: name,
        description: "discription here", // Optional field
        price,
        isFeatured: false, // Default value
        isArchived: false, // Default value
        category: { connect: { id: body.categoryId } }, // Connect to existing Category
        learningType: {
          connect: { id: body.learningTypeId }, // Connect to existing LearningType
        },
        taskSpecificity: {
          connect: { id: body.taskSpecificityId }, // Connect to existing TaskSpecificity
        },
        processingType: {
          connect: { id: body.processingTypeId }, // Connect to existing ProcessingType
        },
        size: {
          connect: { id: body.sizeId }, // Connect to existing Size
        },
        store: {
          connect: { id: params.storeId }, // Connect to the related Store
        },
      },
    });

    return NextResponse.json(aiModel);
  } catch (error) {
    console.log("[AIMODEL_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(req: Request, { params }: { params: { storeId: number } }) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const aiModel = await prismadb.aIModel.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(aiModel);
  } catch (error) {
    console.log("[AIMODEL_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
