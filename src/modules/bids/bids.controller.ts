/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from "@nestjs/common";
import { BidsService } from "./bids.service";
import { CreateBidDto } from "./dto/create-bid.dto";
import { UpdateBidDto } from "./dto/update-bid.dto";
// import { AuthGuard } from "../../guards/auth.guard";
// import { ValidateBidUpdateGuard } from "../../guards/validate-bid-update.guard";
// import { ValidateBidDeletionGuard } from "../../guards/validate-bid-deletion.guard";
import { ValidateBidCreationGuard } from "src/guards/validate-bid-creation.guard";
import { HttpAuthGuard } from "../auth/guards/auth.guard";
import { Request } from "express";

@Controller("bids")
@UseGuards(HttpAuthGuard)
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post()
  @UseGuards(ValidateBidCreationGuard)
  create(@Req() req: Request, @Body() createBidDto: CreateBidDto) {

    const data = this.bidsService.create(req.user.id.toString(), createBidDto);
    
    return {
      success: true,
      statusCode: 201,
      data,
    };
  }

  @Get("auction/:auctionId")
  findByAuction(@Param("auctionId") auctionId: string) {
    return this.bidsService.findByAuction(auctionId);
  }

  @Get("product/:productId")
  findAll(
    @Query()
    filters: {
      user?: string;
      product?: string;
      auction?: string;
      status?: string;
      minAmount?: number;
      maxAmount?: number;
      startDate?: Date;
      endDate?: Date;
      page?: number;
      limit?: number;
      sort?: string;
    }
  ) {
    return this.bidsService.findAll(filters);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.bidsService.findOne(id);
  }

  @Patch(":id")
  // @UseGuards(ValidateBidUpdateGuard)
  update(@Param("id") id: string, @Body() updateBidDto: UpdateBidDto) {
    return this.bidsService.update(id, updateBidDto);
  }

  @Delete(":id")
  // @UseGuards(ValidateBidDeletionGuard)
  remove(@Param("id") id: string) {
    return this.bidsService.remove(id);
  }
}
