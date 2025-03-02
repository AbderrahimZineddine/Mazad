/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SalesModule } from './sales/sales.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { AuctionsModule } from './auctions/auction.module';
import { AuthModule } from './auth/auth.module';
import { BidsModule } from './bids/bids.module';
import { BannerModule } from './banner/banner.module';

@Module({
  imports: [

    //TODO ??? 
    // ConfigModule.forRoot({
    //   isGlobal: true, // Makes the config available globally
    // }),


    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/auction-app',
    ),
    SalesModule,
    AuctionsModule,
    UsersModule,
    ProductsModule,
    AuthModule,
    BidsModule,
    BannerModule,
  ],
})
export class AppModule {}
