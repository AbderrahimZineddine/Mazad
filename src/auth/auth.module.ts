/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../users/schemas/user.schema";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { OTPService } from "./otp.service";
import { RefreshToken, RefreshTokenSchema } from "./schemas/refresh-token.schema";
import { ConfigModule, ConfigService } from "@nestjs/config";  // Added ConfigModule import
import { AuthGuard } from "src/guards/auth.guard";

@Module({
  imports: [
    ConfigModule,  // Import ConfigModule to make ConfigService available
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule], // Include ConfigModule here so ConfigService is provided
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: {
          expiresIn: configService.get("ACCESS_TOKEN_EXPIRATION"),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, OTPService, AuthGuard],
  exports: [
    AuthGuard,
    JwtModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class AuthModule {}
