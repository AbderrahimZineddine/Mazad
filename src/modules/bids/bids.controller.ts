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
  async create(@Req() req: Request, @Body() createBidDto: CreateBidDto) {
    console.log(req.user.id);
    const data = await this.bidsService.create(
      req.user.id.toString(),
      createBidDto
    );

    return {
      success: true,
      statusCode: 201,
      data,
    };
  }

  // @Get("auction/:auctionId")
  // async findByAuction(@Param("auctionId") auctionId: string) {
  //   const data = await this.bidsService.findByAuction(auctionId);
  //   return {
  //     success: true,
  //     statusCode: 201,
  //     data,
  //   };
  // }

  @Get("product/:productId")
  async findAll(
    @Param("productId") productId: string,
    @Query("name") name?: string,
    @Query("user") user?: string,
    @Query("status") status?: string,
    @Query("region") region?: string,
    @Query("minAmount") minAmount?: number,
    @Query("maxAmount") maxAmount?: number,
    @Query("startDate") startDate?: string, // pass as string to later convert to Date
    @Query("endDate") endDate?: string,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 100,
    @Query("sort") sort: string = "-createdAt"
  ) {
    const filters = {
      name,
      user,
      status,
      region,
      minAmount,
      maxAmount,
      startDate,
      endDate,
      page,
      limit,
      sort,
    };

    const data = await this.bidsService.findAll(productId, filters);

    return {
      success: true,
      statusCode: 200,
      limit,
      page,
      data,
    };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const data = await this.bidsService.findOne(id);

    return {
      success: true,
      statusCode: 200,
      data,
    };
  }

  @Patch(":id")
  // @UseGuards(ValidateBidUpdateGuard)
  async update(@Param("id") id: string, @Body() updateBidDto: UpdateBidDto) {
    const data = await this.bidsService.update(id, updateBidDto);

    return {
      success: true,
      statusCode: 200,
      data,
    };
  }

  @Delete(":id")
  // @UseGuards(ValidateBidDeletionGuard)
  async remove(@Param("id") id: string) {
    const message = await this.bidsService.remove(id);

    return {
      success: true,
      statusCode: 200,
      message,
    };
  }
}
