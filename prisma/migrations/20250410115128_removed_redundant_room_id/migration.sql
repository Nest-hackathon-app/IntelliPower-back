/*
  Warnings:

  - You are about to drop the column `areaId` on the `Electricity` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Electricity" DROP CONSTRAINT "Electricity_areaId_fkey";

-- DropIndex
DROP INDEX "Electricity_areaId_idx";

-- AlterTable
ALTER TABLE "Electricity" DROP COLUMN "areaId";
