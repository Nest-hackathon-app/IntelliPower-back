/*
  Warnings:

  - You are about to drop the column `areaId` on the `Temperature` table. All the data in the column will be lost.
  - Added the required column `sensorId` to the `Temperature` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Temperature" DROP CONSTRAINT "Temperature_areaId_fkey";

-- DropIndex
DROP INDEX "Temperature_areaId_idx";

-- AlterTable
ALTER TABLE "Temperature" DROP COLUMN "areaId",
ADD COLUMN     "sensorId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Temperature_sensorId_idx" ON "Temperature"("sensorId");

-- AddForeignKey
ALTER TABLE "Temperature" ADD CONSTRAINT "Temperature_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "sensor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
