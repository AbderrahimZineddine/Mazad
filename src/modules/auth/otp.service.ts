/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";

@Injectable()
export class OTPService {
  //   async sendOTP(phone: string) {
  sendOTP(phone: string) {
    // Implement actual OTP sending logic
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`OTP for ${phone}: ${otp}`);
    return { success: true };
  }

  //   async verifyOTP(phone: string, otp: string) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  verifyOTP(phone: string, otp: string) {
    // Implement actual OTP verification logic
    return true; // Temporary implementation
  }
}
