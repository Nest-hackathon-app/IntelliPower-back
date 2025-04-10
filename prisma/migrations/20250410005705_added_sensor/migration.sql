/*
  Warnings:

  - The `polygon` column on the `Area` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SensorType" AS ENUM ('temperature');

-- AlterTable
ALTER TABLE "Area" DROP COLUMN "polygon",
ADD COLUMN     "polygon" JSONB[];

-- CreateTable
CREATE TABLE "sensor" (
    "id" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,
    "locationX" DOUBLE PRECISION NOT NULL,
    "locationY" DOUBLE PRECISION NOT NULL,
    "type" "SensorType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sensor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sensor_areaId_idx" ON "sensor"("areaId");

-- AddForeignKey
ALTER TABLE "sensor" ADD CONSTRAINT "sensor_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
