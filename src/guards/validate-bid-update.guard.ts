/* eslint-disable prettier/prettier */
// src/guards/validate-bid-update.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { BidsService } from "../modules/bids/bids.service";
import { RequestWithUser } from "../types/request-with-user.type";
import { AuctionsService } from "src/modules/auctions/auction.service";
import { ProductsService } from "src/modules/products/products.service";

@Injectable()
export class ValidateBidUpdateGuard implements CanActivate {
  constructor(
    private readonly bidsService: BidsService,
    private readonly auctionsService: AuctionsService,
    private readonly productsService: ProductsService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const bidId = req.params.id;

    const bid = await this.bidsService.findOne(bidId);
    if (!bid) throw new NotFoundException("Bid not found");

    const auction = await this.auctionsService.findByProduct(bid.product.id);
    if (!auction) throw new NotFoundException("Auction not found");

    // Verify ownership
    if (bid.user.id !== req.user.id) {
      throw new ForbiddenException("Not authorized to modify this bid");
    }

    // Check auction status
    if (auction.status === "Closed") {
      throw new ForbiddenException("Auction is closed for bidding");
    }

    // Check bid status
    if (["Accepted", "Rejected"].includes(bid.status)) {
      throw new ForbiddenException("Cannot modify accepted/rejected bids");
    }

    // Validate amount/quantity if present
    if (req.body.amount || req.body.quantity) {
      const product = await this.productsService.findOne(bid.product.id);

      if (req.body.amount && req.body.amount < product.price) {
        throw new ForbiddenException(
          `Bid amount must be at least ${product.price}`
        );
      }

      if (req.body.quantity && req.body.quantity > product.stock) {
        throw new ForbiddenException(
          `Requested quantity exceeds available stock (${product.stock})`
        );
      }
    }

    return true;
  }
}
