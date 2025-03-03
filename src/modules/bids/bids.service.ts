/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Bid } from "./schemas/bid.schema";
import { Auction } from "../auctions/schemas/auction.schema";
import { Product } from "../products/schemas/product.schema";
import { User } from "../users/schemas/user.schema";
import { CreateBidDto } from "./dto/create-bid.dto";
import { UpdateBidDto } from "./dto/update-bid.dto";

@Injectable()
export class BidsService {
  constructor(
    @InjectModel(Bid.name) private bidModel: Model<Bid>,
    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async create(userId: string, createBidDto: CreateBidDto) {
    const existingBid = await this.bidModel.findOne({
      user: userId,
      product: createBidDto.product,
    });

    if (existingBid) {
      throw new ConflictException("You already have a bid for this product");
    }

    const product = await this.productModel.findById(createBidDto.product);
    if (!product) throw new NotFoundException("Product not found");

    if (createBidDto.amount < product.price) {
      throw new BadRequestException(
        `Bid amount must be at least ${product.price}`
      );
    }

    if (createBidDto.quantity > product.stock) {
      throw new BadRequestException(
        `Requested quantity exceeds available stock (${product.stock})`
      );
    }

    return this.bidModel.create({
      ...createBidDto,
      user: userId,
    });
  }

  async findByAuction(auctionId: string) {
    const auction = await this.auctionModel.findById(auctionId);
    if (!auction) throw new NotFoundException("Auction not found");

    return this.bidModel.aggregate([
      // { $match: { product: { $in: auction.products } } },
      { $sort: { amount: -1, createdAt: -1 } },
      {
        $group: {
          _id: "$product",
          bids: { $push: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
          pipeline: [{ $project: { name: 1, image: 1, description: 1 } }],
        },
      },
      { $unwind: "$product" },
      { $project: { product: 1, topBids: { $slice: ["$bids", 3] } } },
      { $sort: { "product.name": 1 } },
    ]);
  }

  async findAll(filters: any) {
    const query: any = {};

    if (filters.user) query.user = new Types.ObjectId(filters.user);

  
    if (filters.product) query.product = new Types.ObjectId(filters.product);
    if (filters.status) query.status = filters.status;

    if (filters.minAmount || filters.maxAmount) {
      query.amount = {};
      if (filters.minAmount) query.amount.$gte = filters.minAmount;
      if (filters.maxAmount) query.amount.$lte = filters.maxAmount;
    }

    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
      if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
    }

    if (filters.auction) {
      const auction = await this.auctionModel.findById(filters.auction);
      if (!auction) throw new NotFoundException("Auction not found");
      // query.product = { $in: auction.products };
    }

    return this.bidModel
      .find(query)
      .populate("user", "name email")
      .populate("product", "name price");
  }

  async findOne(id: string) {
    const bid = await this.bidModel.findById(id);
    if (!bid) throw new NotFoundException("Bid not found");
    return bid;
  }

  async update(id: string, updateBidDto: UpdateBidDto) {
    const bid = await this.bidModel.findByIdAndUpdate(id, updateBidDto, {
      new: true,
    });
    if (!bid) throw new NotFoundException("Bid not found");
    return bid;
  }

  async remove(id: string) {
    const bid = await this.bidModel.findByIdAndDelete(id);
    if (!bid) throw new NotFoundException("Bid not found");
    return bid;
  }
}
