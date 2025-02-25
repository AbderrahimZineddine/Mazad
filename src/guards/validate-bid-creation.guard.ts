/* eslint-disable prettier/prettier */
// src/guards/validate-bid-creation.guard.ts
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
    ForbiddenException,
  } from '@nestjs/common';
  import { RequestWithUser } from '../types/request-with-user.type';
  import { ProductsService } from '../products/products.service';
import { AuctionsService } from 'src/auctions/auction.service';
  
  @Injectable()
  export class ValidateBidCreationGuard implements CanActivate {
    constructor(
      private readonly auctionsService: AuctionsService,
      private readonly productsService: ProductsService,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest<RequestWithUser>();
      const product = await this.productsService.findOne(req.body.product);
  
      if (!product) throw new NotFoundException('Product not found');
  
      const auction = await this.auctionsService.findByProduct(product.id);
      if (!auction) throw new NotFoundException('Auction not found');
  
      if (!auction.subscribers.includes(req.user.id)) {
        throw new ForbiddenException(
          'You must subscribe to the auction to place bids',
        );
      }
  
      if (auction.status === 'Closed') {
        throw new ForbiddenException('Auction is closed for bidding');
      }
  
      return true;
    }
  }
  