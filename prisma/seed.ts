import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
   // Generate 10 sample electricity readings for Load1
  const electricityData = Array.from({ length: 40 }).map((_, i) => ({
    sensorId: 'Load1',
    power: 100 + Math.random() * 50, // power between 100–150W
    voltage: 220 + Math.random() * 5, // voltage between 220–225V
    createdAt: new Date(Date.now() - i * 3600 * 1000),
  }));

 
  await prisma.electricity.createMany({
    data: electricityData,
  });

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
