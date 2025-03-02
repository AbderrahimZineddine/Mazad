/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { BannerService } from "./banner.service";
import { BannerController } from "./banner.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "src/auth/auth.module";
import { UsersModule } from "src/users/users.module";
import { Banner, BannerSchema } from "./schamas/banner.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Banner.name, schema: BannerSchema }]),
    AuthModule, // Brings in AuthGuard and JwtService
    UsersModule,
  ],
  controllers: [BannerController],
  providers: [BannerService],
})
export class BannerModule {}
