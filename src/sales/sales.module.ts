/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { Sales, SalesSchema } from './schemas/sales.schema';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sales.name, schema: SalesSchema }]),
    AuthModule, // Brings in AuthGuard and JwtService
    UsersModule,
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}