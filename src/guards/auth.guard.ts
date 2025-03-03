/* eslint-disable prettier/prettier */
// src/auth/guards/auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Request } from "express";
import { User, UserDocument } from "src/modules/users/schemas/user.schema";
import { RequestWithUser } from "src/types/request-with-user.type";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException("Please log in to access this route");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      console.log(`Payload is ${payload}`);
      const user = await this.userModel.findById(payload.id);
      if (!user) {
        throw new UnauthorizedException("User no longer exists");
      }

      request.user = user;
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException("Invalid or expired token");
    }
  }

  private extractToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
