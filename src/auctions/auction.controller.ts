/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  
} from "@nestjs/common";
// import { AuthGuard } from "src/guards/auth.guard";
// import { AdminGuard } from "src/guards/admin.guard";
import { CreateAuctionDto } from "./dto/create-auction.dto";
import { UpdateAuctionDto } from "./dto/update-auction.dto";
import { AuctionsService } from "./auction.service";
import { Types } from "mongoose";
import { User } from "src/decorators/user.decorator";

@Controller("auctions")
// @UseGuards(AuthGuard)
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  // Methods will go here
  @Post()
  // @UseGuards(AdminGuard)
  @HttpCode(201)
  async createAuction(@Body() createAuctionDto: CreateAuctionDto) {
    const auction = await this.auctionsService.create(createAuctionDto);
    return {
      success: true,
      statusCode: 201,
      data: auction,
    };
  }

  @Get(":id")
  async getAuction(@Param("id") id: string) {
    const auction = await this.auctionsService.findOne(id);
    return {
      success: true,
      statusCode : 200,
      data: auction,
    };
  }

  @Get()
  async getAllAuctions(
    @Query("status") status: string,
    @Query("region") region: string,
    @Query("title") title: string,
    @Query("endingDate") endingDate: Date,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 100
  ) {
    const auctions = await this.auctionsService.findAll({
      status,
      region,
      title,
      endingDate,
      page,
      limit,
    });

    return {
      success: true,
      statusCode : 200,
      page,
      limit,
      data: auctions,
    };
  }

  @Patch(":id")
  // @UseGuards(AdminGuard)
  async updateAuction(
    @Param("id") id: string,
    @Body() updateAuctionDto: UpdateAuctionDto
  ) {
    const auction = await this.auctionsService.update(id, updateAuctionDto);
    return {
      success: true,
      statusCode : 200,
      data: auction,
    };
  }

  @Delete(":id")
  // @UseGuards(AdminGuard)
  @HttpCode(204)
  async deleteAuction(@Param("id") id: string) {
    await this.auctionsService.remove(id);
    return {
      success: true,
      statusCode : 204,
      message: "Auction deleted successfully",
    };
  }

  @Post(":id/subscribe")
  async subscribeToAuction(
    @Param("id") auctionId: string,
    @User() user: { _id: Types.ObjectId }, // user.id is a string
    // @Body("usePoints") usePoints: boolean
  ) {
    const auction = await this.auctionsService.subscribe(
      auctionId,
      user._id, // Now passing ObjectId
      // usePoints
    );

    return {
      success: true,
      data: auction,
    };
  }

  @Get("my")
  async getUserAuctions(@User() user: { _id: Types.ObjectId }) {
    const auctions = await this.auctionsService.getUserAuctions(user._id);
    return {
      success: true,
      data: auctions,
    };
  }

  @Get("with-subscriptions")
  async getAuctionsWithSubscriptions(@User() user: { _id: Types.ObjectId }) {
    const auctions = await this.auctionsService.getWithSubscriptions(user._id);
    return {
      success: true,
      data: auctions,
    };
  }
}
