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
      isFeatured,
      isArchived,
      billboardId, 
      agentId,
      storeId
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
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
        isFeatured: false, // Default value
        isArchived: false, // Default value
        billboard: { connect: { id: body.billboardId } }, 
        agent: { connect: { id: body.agentId } },       
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
