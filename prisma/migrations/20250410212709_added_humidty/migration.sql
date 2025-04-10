/*
  Warnings:

  - Added the required column `humidity` to the `Temperature` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Temperature" ADD COLUMN     "humidity" DOUBLE PRECISION NOT NULL;
