/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'employee');

-- CreateEnum
CREATE TYPE "AreaType" AS ENUM ('server_room', 'call_center', 'office', 'hallway', 'restricted');

-- CreateEnum
CREATE TYPE "AnomalyStatus" AS ENUM ('active', 'resolved');

-- DropTable
DROP TABLE "user";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'employee',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Floor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Floor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entrance" (
    "userId" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,
    "enteredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Entrance_pkey" PRIMARY KEY ("userId","areaId","enteredAt")
);

-- CreateTable
CREATE TABLE "Camera" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "floorId" TEXT NOT NULL,
    "locationX" DOUBLE PRECISION NOT NULL,
    "locationY" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Camera_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Area" (
    "id" TEXT NOT NULL,
    "floorId" TEXT NOT NULL,
    "type" "AreaType" NOT NULL,
    "name" TEXT NOT NULL,
    "polygon" JSONB NOT NULL,
    "capacity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Temperature" (
    "id" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,
    "temp" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Temperature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Electricity" (
    "id" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,
    "usage" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Electricity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anomaly" (
    "id" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "AnomalyStatus" NOT NULL DEFAULT 'active',
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "Anomaly_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AreaToCamera" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AreaToCamera_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_companyId_idx" ON "User"("companyId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Floor_companyId_idx" ON "Floor"("companyId");

-- CreateIndex
CREATE INDEX "Entrance_areaId_idx" ON "Entrance"("areaId");

-- CreateIndex
CREATE INDEX "Entrance_userId_idx" ON "Entrance"("userId");

-- CreateIndex
CREATE INDEX "Camera_floorId_idx" ON "Camera"("floorId");

-- CreateIndex
CREATE INDEX "Area_floorId_idx" ON "Area"("floorId");

-- CreateIndex
CREATE INDEX "Area_name_idx" ON "Area"("name");

-- CreateIndex
CREATE INDEX "Temperature_areaId_idx" ON "Temperature"("areaId");

-- CreateIndex
CREATE INDEX "Temperature_createdAt_idx" ON "Temperature"("createdAt");

-- CreateIndex
CREATE INDEX "Electricity_areaId_idx" ON "Electricity"("areaId");

-- CreateIndex
CREATE INDEX "Electricity_createdAt_idx" ON "Electricity"("createdAt");

-- CreateIndex
CREATE INDEX "Anomaly_areaId_idx" ON "Anomaly"("areaId");

-- CreateIndex
CREATE INDEX "Anomaly_status_idx" ON "Anomaly"("status");

-- CreateIndex
CREATE INDEX "Anomaly_reportedAt_idx" ON "Anomaly"("reportedAt");

-- CreateIndex
CREATE INDEX "_AreaToCamera_B_index" ON "_AreaToCamera"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Floor" ADD CONSTRAINT "Floor_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrance" ADD CONSTRAINT "Entrance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrance" ADD CONSTRAINT "Entrance_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Camera" ADD CONSTRAINT "Camera_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "Floor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Area" ADD CONSTRAINT "Area_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "Floor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Temperature" ADD CONSTRAINT "Temperature_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Electricity" ADD CONSTRAINT "Electricity_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anomaly" ADD CONSTRAINT "Anomaly_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AreaToCamera" ADD CONSTRAINT "_AreaToCamera_A_fkey" FOREIGN KEY ("A") REFERENCES "Area"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AreaToCamera" ADD CONSTRAINT "_AreaToCamera_B_fkey" FOREIGN KEY ("B") REFERENCES "Camera"("id") ON DELETE CASCADE ON UPDATE CASCADE;
