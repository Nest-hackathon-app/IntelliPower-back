import { PrismaClient } from '@prisma/client';
import { sensorsData } from './data/sensors.data';

const db = new PrismaClient();

async function main() {
  const data = await db.sensor.createMany({
    skipDuplicates: true,
    data: sensorsData,
  });
  console.log(`Inserted ${data.count} sensors`);
  await db.$disconnect();
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
