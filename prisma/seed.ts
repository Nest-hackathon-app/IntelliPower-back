
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Generate 10 sample temperature readings for sensor-1
  const temperatureData = Array.from({ length: 40 }).map((_, i) => ({
    sensorId: 'sensor-1',
    temp: 20 + Math.random() * 5, // temp between 20–25°C
    humidity: 40 + Math.random() * 10, // humidity between 40–50%
    createdAt: new Date(Date.now() - i * 3600 * 1000), // 1 hour intervals
  }))

  // Generate 10 sample electricity readings for Load1
  const electricityData = Array.from({ length: 40 }).map((_, i) => ({
    sensorId: 'Load1',
    power: 100 + Math.random() * 50, // power between 100–150W
    voltage: 220 + Math.random() * 5, // voltage between 220–225V
    createdAt: new Date(Date.now() - i * 3600 * 1000),
  }))

  await prisma.temperature.createMany({
    data: temperatureData,
  })

  await prisma.electricity.createMany({
    data: electricityData,
  })

  console.log('✅ Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
