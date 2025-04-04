/*
  Warnings:

  - Added the required column `agentId` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `agentId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "agentId" INT8 NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "agentId" INT8 NOT NULL;

-- CreateTable
CREATE TABLE "agent" (
    "_id" INT8 NOT NULL DEFAULT unique_rowid(),
    "storeId" INT8 NOT NULL,
    "aiModelId" INT8 NOT NULL,
    "name" STRING NOT NULL,
    "price" FLOAT8 NOT NULL,
    "isFeatured" BOOL NOT NULL DEFAULT false,
    "isArchived" BOOL NOT NULL DEFAULT false,
    "sizeId" INT8 NOT NULL,
    "learningTypeId" INT8 NOT NULL,
    "taskSpecificityId" INT8 NOT NULL,
    "processingTypeId" INT8 NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "AIModel" (
    "_id" INT8 NOT NULL DEFAULT unique_rowid(),
    "storeId" INT8 NOT NULL,
    "billboardId" INT8 NOT NULL,
    "name" STRING NOT NULL,
    "isFeatured" BOOL NOT NULL DEFAULT false,
    "isArchived" BOOL NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIModel_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "LearningType" (
    "_id" INT8 NOT NULL DEFAULT unique_rowid(),
    "type" STRING NOT NULL,
    "description" STRING,
    "storeId" INT8 NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningType_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "TaskSpecificity" (
    "_id" INT8 NOT NULL DEFAULT unique_rowid(),
    "type" STRING NOT NULL,
    "description" STRING,
    "storeId" INT8 NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskSpecificity_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "ProcessingType" (
    "_id" INT8 NOT NULL DEFAULT unique_rowid(),
    "type" STRING NOT NULL,
    "description" STRING,
    "storeId" INT8 NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcessingType_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "tool" (
    "_id" INT8 NOT NULL DEFAULT unique_rowid(),
    "storeId" INT8 NOT NULL,
    "name" STRING NOT NULL,
    "value" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tool_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "_agentTotool" (
    "A" INT8 NOT NULL,
    "B" INT8 NOT NULL
);

-- CreateIndex
CREATE INDEX "agent_storeId_idx" ON "agent"("storeId");

-- CreateIndex
CREATE INDEX "agent_aiModelId_idx" ON "agent"("aiModelId");

-- CreateIndex
CREATE INDEX "agent_learningTypeId_idx" ON "agent"("learningTypeId");

-- CreateIndex
CREATE INDEX "agent_taskSpecificityId_idx" ON "agent"("taskSpecificityId");

-- CreateIndex
CREATE INDEX "agent_sizeId_idx" ON "agent"("sizeId");

-- CreateIndex
CREATE INDEX "agent_processingTypeId_idx" ON "agent"("processingTypeId");

-- CreateIndex
CREATE INDEX "AIModel_storeId_idx" ON "AIModel"("storeId");

-- CreateIndex
CREATE INDEX "AIModel_billboardId_idx" ON "AIModel"("billboardId");

-- CreateIndex
CREATE INDEX "LearningType_storeId_idx" ON "LearningType"("storeId");

-- CreateIndex
CREATE INDEX "TaskSpecificity_storeId_idx" ON "TaskSpecificity"("storeId");

-- CreateIndex
CREATE INDEX "ProcessingType_storeId_idx" ON "ProcessingType"("storeId");

-- CreateIndex
CREATE INDEX "tool_storeId_idx" ON "tool"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "_agentTotool_AB_unique" ON "_agentTotool"("A", "B");

-- CreateIndex
CREATE INDEX "_agentTotool_B_index" ON "_agentTotool"("B");

-- AddForeignKey
ALTER TABLE "agent" ADD CONSTRAINT "agent_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent" ADD CONSTRAINT "agent_aiModelId_fkey" FOREIGN KEY ("aiModelId") REFERENCES "AIModel"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent" ADD CONSTRAINT "agent_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "Size"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent" ADD CONSTRAINT "agent_learningTypeId_fkey" FOREIGN KEY ("learningTypeId") REFERENCES "LearningType"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent" ADD CONSTRAINT "agent_taskSpecificityId_fkey" FOREIGN KEY ("taskSpecificityId") REFERENCES "TaskSpecificity"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent" ADD CONSTRAINT "agent_processingTypeId_fkey" FOREIGN KEY ("processingTypeId") REFERENCES "ProcessingType"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIModel" ADD CONSTRAINT "AIModel_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIModel" ADD CONSTRAINT "AIModel_billboardId_fkey" FOREIGN KEY ("billboardId") REFERENCES "Billboard"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agent"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningType" ADD CONSTRAINT "LearningType_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskSpecificity" ADD CONSTRAINT "TaskSpecificity_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessingType" ADD CONSTRAINT "ProcessingType_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tool" ADD CONSTRAINT "tool_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agent"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_agentTotool" ADD CONSTRAINT "_agentTotool_A_fkey" FOREIGN KEY ("A") REFERENCES "agent"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_agentTotool" ADD CONSTRAINT "_agentTotool_B_fkey" FOREIGN KEY ("B") REFERENCES "tool"("_id") ON DELETE CASCADE ON UPDATE CASCADE;
