-- AlterTable
ALTER TABLE "Electricity" ADD COLUMN     "predictedConsumption" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Temperature" ADD COLUMN     "aiHumidityPrediction" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "aiPrediction" DOUBLE PRECISION NOT NULL DEFAULT 0;
