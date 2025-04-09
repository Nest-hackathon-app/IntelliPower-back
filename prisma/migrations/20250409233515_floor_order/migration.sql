/*
  Warnings:

  - A unique constraint covering the columns `[companyId,order]` on the table `Floor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Floor" ADD COLUMN     "order" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Floor_companyId_order_key" ON "Floor"("companyId", "order");
