-- CreateEnum
CREATE TYPE "SecurityProfile" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "FanSpeed" AS ENUM ('low', 'medium', 'high');

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "securityProfile" "SecurityProfile" NOT NULL DEFAULT 'low';

-- AlterTable
ALTER TABLE "Fan" ADD COLUMN     "speed" "FanSpeed" NOT NULL DEFAULT 'medium';
