/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AreaToCamera` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `Areaid` to the `Camera` table without a default value. This is not possible if the table is not empty.
  - Added the required column `areaId` to the `Camera` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Entrance" DROP CONSTRAINT "Entrance_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_companyId_fkey";

-- DropForeignKey
ALTER TABLE "_AreaToCamera" DROP CONSTRAINT "_AreaToCamera_A_fkey";

-- DropForeignKey
ALTER TABLE "_AreaToCamera" DROP CONSTRAINT "_AreaToCamera_B_fkey";

-- AlterTable
ALTER TABLE "Camera" ADD COLUMN     "Areaid" TEXT NOT NULL,
ADD COLUMN     "areaId" TEXT NOT NULL;

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "_AreaToCamera";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'employee',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_companyId_idx" ON "user"("companyId");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user"("email");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrance" ADD CONSTRAINT "Entrance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Camera" ADD CONSTRAINT "Camera_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
