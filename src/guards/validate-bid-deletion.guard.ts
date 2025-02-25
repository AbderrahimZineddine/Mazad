/* eslint-disable prettier/prettier */
// src/guards/validate-bid-deletion.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { BidsService } from "../bids/bids.service";
import { UsersService } from "../users/users.service";
import { RequestWithUser } from "../types/request-with-user.type";

@Injectable()
export class ValidateBidDeletionGuard implements CanActivate {
  constructor(
    private readonly bidsService: BidsService,
    private readonly usersService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const bidId = req.params.id;

    const bid = await this.bidsService.findOne(bidId);
    if (!bid) throw new NotFoundException("Bid not found");

    const user = await this.usersService.getUser(req.user.id);

    // Check if user is owner or admin
    if (bid.user.id !== req.user.id && user.role !== "Admin") {
      throw new ForbiddenException("Not authorized to delete this bid");
    }

    return true;
  }
}
