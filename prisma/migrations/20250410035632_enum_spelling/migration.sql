/*
  Warnings:

  - The values [temperature] on the enum `SensorType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SensorType_new" AS ENUM ('TEMPERATURE');
ALTER TABLE "sensor" ALTER COLUMN "type" TYPE "SensorType_new" USING ("type"::text::"SensorType_new");
ALTER TYPE "SensorType" RENAME TO "SensorType_old";
ALTER TYPE "SensorType_new" RENAME TO "SensorType";
DROP TYPE "SensorType_old";
COMMIT;
