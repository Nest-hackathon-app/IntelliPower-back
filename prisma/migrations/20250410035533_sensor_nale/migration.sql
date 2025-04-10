/*
  Warnings:

  - Added the required column `name` to the `sensor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sensor" ADD COLUMN     "name" TEXT NOT NULL;
