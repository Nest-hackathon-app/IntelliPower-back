//TODO remove
/* eslint-disable @typescript-eslint/no-floating-promises */
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  onModuleInit() {
    this.$connect().then(() => {});
  }
  onModuleDestroy() {
    this.$disconnect().then(() => {});
  }
  constructor() {
    super();
  }
}
