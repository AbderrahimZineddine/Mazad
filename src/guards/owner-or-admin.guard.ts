/* eslint-disable prettier/prettier */
// src/guards/owner-or-admin.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { RequestWithUser } from "../types/request-with-user.type";

@Injectable()
export class OwnerOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const requestedUserId = request.params.userId;

    if (
      request.user.role !== "Admin" &&
      requestedUserId !== request.user.id.toString()
    ) {
      throw new ForbiddenException("Not authorized to access this resource");
    }

    return true;
  }
}
