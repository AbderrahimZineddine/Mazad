/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Auction } from "./schemas/auction.schema";
import { User } from "../users/schemas/user.schema";
import { CreateAuctionDto } from "./dto/create-auction.dto";
import { UpdateAuctionDto } from "./dto/update-auction.dto";

@Injectable()
export class AuctionsService {
  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  // Methods will go here
  async create(createAuctionDto: CreateAuctionDto): Promise<Auction> {
    try {
      const newAuction = new this.auctionModel(createAuctionDto);
      return await newAuction.save();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException("Failed to create auction");
    }
  }

  async findOne(id: string): Promise<Auction> {
    const auction = await this.auctionModel.findById(id);
    if (!auction) throw new NotFoundException("Auction not found");
    return auction;
  }

  async findAll(filters: {
    status?: string;
    wilaya?: string;
    page: number;
    limit: number;
  }): Promise<Auction[]> {
    const query: any = {};

    if (filters.status) query.status = filters.status;
    if (filters.wilaya) query.wilaya = filters.wilaya;

    return this.auctionModel
      .find(query)
      .skip((filters.page - 1) * filters.limit)
      .limit(filters.limit)
      .sort("-createdAt")
      .exec();
  }

  async update(
    id: string,
    updateAuctionDto: UpdateAuctionDto
  ): Promise<Auction> {
    const auction = await this.auctionModel.findByIdAndUpdate(
      id,
      updateAuctionDto,
      { new: true, runValidators: true }
    );

    if (!auction) throw new NotFoundException("Auction not found");
    return auction;
  }

  async remove(id: string): Promise<void> {
    const result = await this.auctionModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException("Auction not found");
  }

  async subscribe(
    auctionId: string,
    userId: Types.ObjectId,
    usePoints: boolean
  ): Promise<Auction> {
    const auction = await this.auctionModel.findById(auctionId);
    if (!auction) throw new NotFoundException("Auction not found");

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    if (auction.subscribers.some((subId) => subId.equals(userId))) {
      throw new BadRequestException("Already subscribed");
    }

    if (usePoints) {
      if (user.points < auction.subscriptionFeePoints) {
        throw new BadRequestException('Insufficient points');
      }
      user.points -= auction.subscriptionFeePoints;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await user.save();
    }

    auction.subscribers.push(userId);
    return await auction.save();
  }

  async getUserAuctions(userId: Types.ObjectId): Promise<any> {
    return this.auctionModel.aggregate([
      { $match: { subscribers: userId } },
      {
        $lookup: {
          from: "products",
          localField: "products",
          foreignField: "_id",
          as: "products",
        },
      },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "bids",
          let: { productId: "$products._id", userId: userId },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$product", "$$productId"] },
                    { $eq: ["$user", "$$userId"] },
                  ],
                },
              },
            },
          ],
          as: "userBid",
        },
      },
      {
        $addFields: {
          "products.bid": { $arrayElemAt: ["$userBid", 0] },
        },
      },
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          date: { $first: "$date" },
          wilaya: { $first: "$wilaya" },
          status: { $first: "$status" },
          products: { $push: "$products" },
          createdAt: { $first: "$createdAt" },
        },
      },
    ]);
  }


  async getWithSubscriptions(userId: Types.ObjectId): Promise<any[]> {
    const auctions = await this.auctionModel.find().lean();
    return auctions.map(auction => ({
      ...auction,
      isSubscribed: auction.subscribers.some(subId => subId.equals(userId)),
    }));
  }

  // Add this method
  async findByProduct(productId: string): Promise<Auction> {
    const auction = await this.auctionModel.findOne({
      products: productId
    }).exec();

    if (!auction) {
      throw new NotFoundException('Auction not found for this product');
    }

    return auction;
  }
}
