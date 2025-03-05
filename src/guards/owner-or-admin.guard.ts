/* eslint-disable prettier/prettier */
// src/guards/owner-or-admin.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Request } from "express";
import { UserRoles } from "src/core/enums/user-roles.enum";

@Injectable()
export class OwnerOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const requestedUserId = request.params.userId;

    if (
      request.user.role !== UserRoles.ADMIN &&
      requestedUserId !== request.user.id.toString()
    ) {
      throw new ForbiddenException("Not authorized to access this resource");
    }

    return true;
  }
}
