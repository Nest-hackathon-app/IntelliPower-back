/*
  Warnings:

  - Added the required column `sensorId` to the `Electricity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "SensorType" ADD VALUE 'ELECTRICITY';

-- AlterTable
ALTER TABLE "Electricity" ADD COLUMN     "sensorId" TEXT NOT NULL;
