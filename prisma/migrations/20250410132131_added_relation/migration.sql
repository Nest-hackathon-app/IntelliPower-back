-- AddForeignKey
ALTER TABLE "Electricity" ADD CONSTRAINT "Electricity_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "sensor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
