/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { verifyRefreshToken } from "../utils/jwt.util";
import { User } from "../modules/users/schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { RequestWithUser } from "src/types/request-with-user.type";

@Injectable()
export class RtAuthGuard implements CanActivate {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException("Refresh token is required");
    }

    const payload = verifyRefreshToken(token);
    if (!payload) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    const user = await this.userModel.findById(payload.id);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    // Attach user to request
    request.user = user;
    return true;
  }

  private extractToken(request: Request): string | undefined {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return request.body?.refreshToken;
  }
}
