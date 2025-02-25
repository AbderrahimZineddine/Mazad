/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { User, UserDocument } from "../users/schemas/user.schema";
import { RefreshToken } from "./schemas/refresh-token.schema";
import { OTPService } from "./otp.service";
import { CreateUserDto } from "src/users/dtos/create-user.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
    private jwtService: JwtService,
    private otpService: OTPService
  ) {}

  async register(registerDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({
      phone: registerDto.phone,
    });

    if (existingUser) {
      if (existingUser.isVerified) {
        throw new UnauthorizedException(
          "You already have an account. Please login."
        );
      }
      throw new UnauthorizedException(
        "Pending verification. Enter OTP to verify."
      );
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    await this.userModel.create({
      ...registerDto,
      password: hashedPassword,
    });

    // await this.otpService.sendOTP(registerDto.phone);
    this.otpService.sendOTP(registerDto.phone);

    return { message: "Registration successful. Verify with OTP." };
  }

  async login(phone: string, password: string) {
    const user = await this.userModel.findOne({ phone });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException("Invalid credentials");
    }

    if (!user.isVerified) {
      throw new UnauthorizedException("Verify your phone number first");
    }

    return this.generateTokens(user);
  }

  async verifyOtp(phone: string, otp: string) {
    // Implement OTP verification logic
    // const isValid = await this.otpService.verifyOTP(phone, otp);
    const isValid = this.otpService.verifyOTP(phone, otp);

    if (!isValid) {
      throw new UnauthorizedException("Invalid OTP");
    }

    const user = await this.userModel.findOneAndUpdate(
      { phone },
      { isVerified: true },
      { new: true }
    );

    return this.generateTokens(user!);
  }

  async refreshTokens(user: UserDocument, oldRefreshToken: string) {
    await this.refreshTokenModel.deleteOne({ token: oldRefreshToken });

    return this.generateTokens(user);
  }

  private async generateTokens(user: UserDocument) {
    const payload = { id: user.id };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
    });

    await this.refreshTokenModel.create({
      token: refreshToken,
      user: user._id,
    });

    return { accessToken, refreshToken };
  }

  async forgotPassword(phone: string, newPassword: string) {
    const user = await this.userModel.findOne({ phone });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Add password reset logic
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.newPassword = hashedPassword;
    user.newPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Send OTP for verification
    // await this.otpService.sendOTP(phone);
    this.otpService.sendOTP(phone);

    return {
      message:
        "Password reset initiated. Please verify with OTP sent to your phone.",
    };
  }

  async resendOtp(phone: string) {
    const user = await this.userModel.findOne({ phone });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.isVerified) {
      throw new BadRequestException("User is already verified");
    }

    // await this.otpService.sendOTP(phone);
    this.otpService.sendOTP(phone);

    return {
      message: "New OTP sent successfully",
    };
  }
}
