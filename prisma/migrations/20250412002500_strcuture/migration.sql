-- CreateEnum
CREATE TYPE "FanStatus" AS ENUM ('on', 'off');

-- CreateEnum
CREATE TYPE "PowerStatus" AS ENUM ('on', 'off');

-- CreateEnum
CREATE TYPE "AccessStatus" AS ENUM ('granted', 'pending', 'denied');

-- CreateEnum
CREATE TYPE "DoorStatus" AS ENUM ('open', 'closed');

-- CreateTable
CREATE TABLE "Fan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,
    "locationX" DOUBLE PRECISION NOT NULL,
    "locationY" DOUBLE PRECISION NOT NULL,
    "locationZ" DOUBLE PRECISION NOT NULL,
    "lastMaintenance" TIMESTAMP(3),
    "status" "FanStatus" NOT NULL DEFAULT 'off',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rack" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,
    "locationX" DOUBLE PRECISION NOT NULL,
    "locationY" DOUBLE PRECISION NOT NULL,
    "locationZ" DOUBLE PRECISION NOT NULL,
    "lastMaintenance" TIMESTAMP(3),
    "fanStatus" "FanStatus" NOT NULL DEFAULT 'off',
    "powerStatus" "PowerStatus" NOT NULL DEFAULT 'off',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Door" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,
    "startX" DOUBLE PRECISION NOT NULL,
    "startY" DOUBLE PRECISION NOT NULL,
    "status" "DoorStatus" NOT NULL DEFAULT 'closed',
    "endX" DOUBLE PRECISION NOT NULL,
    "endY" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Door_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoorAccess" (
    "id" TEXT NOT NULL,
    "status" "AccessStatus" NOT NULL DEFAULT 'pending',
    "doorId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DoorAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Fan_areaId_idx" ON "Fan"("areaId");

-- CreateIndex
CREATE INDEX "Rack_areaId_idx" ON "Rack"("areaId");

-- CreateIndex
CREATE INDEX "Door_areaId_idx" ON "Door"("areaId");

-- CreateIndex
CREATE INDEX "DoorAccess_doorId_idx" ON "DoorAccess"("doorId");

-- CreateIndex
CREATE INDEX "DoorAccess_userId_idx" ON "DoorAccess"("userId");

-- AddForeignKey
ALTER TABLE "Fan" ADD CONSTRAINT "Fan_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rack" ADD CONSTRAINT "Rack_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Door" ADD CONSTRAINT "Door_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoorAccess" ADD CONSTRAINT "DoorAccess_doorId_fkey" FOREIGN KEY ("doorId") REFERENCES "Door"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoorAccess" ADD CONSTRAINT "DoorAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
