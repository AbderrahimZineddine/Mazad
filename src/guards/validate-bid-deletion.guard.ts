/* eslint-disable prettier/prettier */
// src/guards/validate-bid-deletion.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { BidsService } from "../modules/bids/bids.service";
import { UsersService } from "../modules/users/users.service";
import { Request } from "express";
import { UserRoles } from "src/core/enums/user-roles.enum";

@Injectable()
export class ValidateBidDeletionGuard implements CanActivate {
  constructor(
    private readonly bidsService: BidsService,
    private readonly usersService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const bidId = req.params.id;

    const bid = await this.bidsService.findOne(bidId);
    if (!bid) throw new NotFoundException("Bid not found");


    // Check if user is owner or admin
    if (bid.user.id !== req.user.id && req.user.role !== UserRoles.ADMIN) {
      throw new ForbiddenException("Not authorized to delete this bid");
    }

    return true;
  }
}
