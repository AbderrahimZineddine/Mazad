/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { User } from "src/decorators/user.decorator";
import { CreateUserDto } from "src/modules/users/dtos/create-user.dto";
import { RtAuthGuard } from "src/guards/rt-auth.guard";
import { UserDocument } from "src/modules/users/schemas/user.schema";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

// DTO Classes
class ForgotPasswordDto {
  // @IsPhoneNumber()
  @IsString()
  phone: string;

  @IsString()
  @MinLength(4)
  newPassword: string;
}

class ResendOtpDto {
  // @IsPhoneNumber()
  @IsString()
  phone: string;
}

class LoginDto {
  // @IsPhoneNumber()
  @IsString()
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() registerDto: CreateUserDto) {
    return this.authService.register(registerDto);
  }

  @Post("verify-otp")
  async verifyOtp(@Body() body: { phone: string; otp: string }) {
    return this.authService.verifyOtp(body.phone, body.otp);
  }

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.phone, loginDto.password);
  }

  @UseGuards(RtAuthGuard)
  @Get("refresh")
  async refreshToken(
    @User() user: UserDocument,
    @Body("refreshToken") refreshToken: string
  ) {
    return this.authService.refreshTokens(user, refreshToken);
  }

  @Post("forgot-password")
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const result = await this.authService.forgotPassword(
      forgotPasswordDto.phone,
      forgotPasswordDto.newPassword
    );
    return {
      success: true,
      data: result,
    };
  }

  @Post("resend-otp") // Changed to POST as it modifies server state
  async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    const result = await this.authService.resendOtp(resendOtpDto.phone);
    return {
      success: true,
      data: result,
    };
  }
}
