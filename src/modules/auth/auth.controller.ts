/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginBodyDto } from './dto/login.dto';
import { ApiResult } from 'src/core/types/api-response';
import { RegisterBodyDto } from './dto/register.dto';
import { RefreshTokenQueryDto } from './dto/refresh-token.dto';
import { CheckResetCodeBodyDto, ForgotPassBodyDto, ResetPassBodyDto } from './dto/reset-password.dto';
import { HttpAuthGuard, UnCheckVerified } from './guards/auth.guard';
import { VerifyAccountBodyDto } from './dto/verify-account.dto';
import { CurrentUser } from './decorators/auth.decorator';
import { Types } from 'mongoose';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Post('login') //* AUTH | Login ~ {{host}}/auth/login
  async login(
    @Body() body: LoginBodyDto
  ): Promise<ApiResult> {
    const { login, password } = body;

    const tokens = await this.authService.login({ login, password });

    return { tokens, message: 'Login successfully' };
  }

  @Post('register')
  async register(
    @Body() body: RegisterBodyDto
  ) {
    const { region, phone, password, name } = body;

    const tokens = await this.authService.register({ region, phone, password, name });

    return { tokens, message: 'Register successfully' };
  }

  @Get('refresh-token')
  async refreshToken(
    @Query() query: RefreshTokenQueryDto
  ) {
    const { refreshToken } = query;

    const tokens = await this.authService.refreshToken(refreshToken);

    return { tokens, message: 'Refresh token successfully' };
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() body: ForgotPassBodyDto
  ) {
    const { email } = body;

    await this.authService.forgotPassword(email);

    return { message: 'Reset code sent successfully' };
  }

  @Post('check-reset-code')
  async checkResetCode(
    @Body() body: CheckResetCodeBodyDto
  ) {
    const { email, otp } = body;

    await this.authService.verifyRestPasswordOtp(email, otp);

    return { message: 'Reset code verified successfully' };
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: ResetPassBodyDto
  ) {
    const { email, otp, password } = body;

    const tokens = await this.authService.resetPassword(email, otp, password);

    return { tokens, message: 'Password reset successfully' };
  }

  @ApiBearerAuth()
  @UseGuards(HttpAuthGuard)
  @UnCheckVerified()
  @Post('resend-verification')
  async resendVerification(
    @CurrentUser() userId: Types.ObjectId
  ) {
    await this.authService.generateAccountVerificationOtp(userId);

    return { message: 'Verification code sent successfully' };
  }

  @ApiBearerAuth()
  @UseGuards(HttpAuthGuard)
  @UnCheckVerified()
  @Post('verify-account')
  async verifyAccount(
    @Body() body: VerifyAccountBodyDto,
    @CurrentUser() userId: Types.ObjectId
  ) {
    const { otp } = body;

    const tokens = await this.authService.verifyAccount(userId, otp);

    return { tokens, message: 'Account verified successfully' };
  }








}
