/* eslint-disable prettier/prettier */
// src/guards/validate-bid-creation.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { AuctionsService } from "src/modules/auctions/auction.service";
import { ProductsService } from "src/modules/products/products.service";
import { Request } from "express";

@Injectable()
export class ValidateBidCreationGuard implements CanActivate {
  constructor(
    private readonly auctionsService: AuctionsService,
    private readonly productsService: ProductsService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    if (!req.body) throw new NotFoundException("Request body is missing");
    const product = await this.productsService.findOne(req.body.product);

    if (!product) throw new NotFoundException("Product not found");

    const auction = await this.auctionsService.findOne(
      product.auction.toString()
    );
    if (!auction) throw new NotFoundException("Auction not found");

    // if (!auction.subscribers.includes(req.user.id)) {
    //   throw new ForbiddenException(
    //     "You must subscribe to the auction to place bids"
    //   );
    // }

    if (auction.status === "Closed") {
      throw new ForbiddenException("Auction is closed for bidding");
    }

    return true;
  }
}
