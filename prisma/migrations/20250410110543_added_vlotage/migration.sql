/*
  Warnings:

  - You are about to drop the column `usage` on the `Electricity` table. All the data in the column will be lost.
  - Added the required column `power` to the `Electricity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voltage` to the `Electricity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Electricity" DROP COLUMN "usage",
ADD COLUMN     "power" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "voltage" DOUBLE PRECISION NOT NULL;
