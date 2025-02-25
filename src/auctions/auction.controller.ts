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
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "src/guards/auth.guard";
import { AdminGuard } from "src/guards/admin.guard";
import { CreateAuctionDto } from "./dto/create-auction.dto";
import { UpdateAuctionDto } from "./dto/update-auction.dto";
import { AuctionsService } from "./auction.service";
import { Types } from "mongoose";
import { User } from "src/decorators/user.decorator";

@Controller("auctions")
@UseGuards(AuthGuard)
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  // Methods will go here
  @Post()
  @UseGuards(AdminGuard)
  @HttpCode(201)
  async createAuction(@Body() createAuctionDto: CreateAuctionDto) {
    const auction = await this.auctionsService.create(createAuctionDto);
    return {
      status: "success",
      data: auction,
    };
  }

  @Get(":id")
  async getAuction(@Param("id") id: string) {
    const auction = await this.auctionsService.findOne(id);
    return {
      status: "success",
      data: auction,
    };
  }

  @Get()
  async getAllAuctions(
    @Query("status") status: string,
    @Query("wilaya") wilaya: string,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 100
  ) {
    const auctions = await this.auctionsService.findAll({
      status,
      wilaya,
      page,
      limit,
    });

    return {
      status: "success",
      results: auctions.length,
      page,
      limit,
      data: auctions,
    };
  }

  @Patch(":id")
  @UseGuards(AdminGuard)
  async updateAuction(
    @Param("id") id: string,
    @Body() updateAuctionDto: UpdateAuctionDto
  ) {
    const auction = await this.auctionsService.update(id, updateAuctionDto);
    return {
      status: "success",
      data: auction,
    };
  }

  @Delete(":id")
  @UseGuards(AdminGuard)
  @HttpCode(204)
  async deleteAuction(@Param("id") id: string) {
    await this.auctionsService.remove(id);
    return {
      status: "success",
      message: "Auction deleted successfully",
      data: null,
    };
  }

  @Post(":id/subscribe")
  async subscribeToAuction(
    @Param("id") auctionId: string,
    @User() user: { _id: Types.ObjectId }, // user.id is a string
    @Body("usePoints") usePoints: boolean
  ) {
    const auction = await this.auctionsService.subscribe(
      auctionId,
      user._id, // Now passing ObjectId
      usePoints
    );

    return {
      status: "success",
      data: auction,
    };
  }

  @Get("my")
  async getUserAuctions(@User() user: { _id: Types.ObjectId }) {
    const auctions = await this.auctionsService.getUserAuctions(user._id);
    return {
      status: "success",
      data: auctions,
    };
  }

  @Get("with-subscriptions")
  async getAuctionsWithSubscriptions(@User() user: { _id: Types.ObjectId }) {
    const auctions = await this.auctionsService.getWithSubscriptions(user._id);
    return {
      status: "success",
      data: auctions,
    };
  }
}
