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
import { AuctionsService } from "src/modules/auctions/auction.service";
import { ProductsService } from "src/modules/products/products.service";
import { Request } from "express";
import { UserRoles } from "src/core/enums/user-roles.enum";
import { Auction } from "src/modules/auctions/schemas/auction.schema";

@Injectable()
export class ValidateBidUpdateGuard implements CanActivate {
  constructor(
    private readonly bidsService: BidsService,
    private readonly auctionsService: AuctionsService,
    private readonly productsService: ProductsService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const bidId = req.params.id;

    const bid = await this.bidsService.findOne(bidId);

    if (!bid) throw new NotFoundException("Bid not found");

    const product = await this.productsService.findOne(bid.product.id);
    if (!product) throw new NotFoundException("Product not found");

    // Verify ownership
    if (bid.user.id !== req.user.id && req.user.role !== UserRoles.ADMIN) {
      throw new ForbiddenException("Not authorized to modify this bid");
    }
    console.log(product.auction);
    // Check auction status
    if (
      (product.auction as unknown as Auction).status === "Closed" &&
      req.body &&
      req.body.amount
    ) {
      throw new ForbiddenException(
        "Auction is closed , you cannot modify the bid amount"
      );
    }

    // Check bid status
    if (["Accepted", "Rejected"].includes(bid.status)) {
      throw new ForbiddenException("Cannot modify accepted/rejected bids");
    }

    // Validate amount/quantity if present
    if (req.body.amount || req.body.quantity) {
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
