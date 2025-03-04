/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product } from "./schemas/product.schema";
import { Auction } from "../auctions/schemas/auction.schema";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Auction.name) private auctionModel: Model<Auction>
  ) {}

  async create(productData: CreateProductDto) {
    const auction = await this.auctionModel.findById(productData.auction);
    if (!auction)
      throw new NotFoundException(
        `There is not Auction with id : ${productData.auction}`
      );

    const newProduct = await this.productModel.create(productData);

    // Populate the fields. In Mongoose 6, .populate() returns a Promise.

    await this.updateAuctionCategorisAndNumber(auction.id);

    await newProduct.populate("auction");
    return newProduct;
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id).populate("auction");
    if (!product) throw new NotFoundException("Product not found");
    return product;
  }

  async findAll(
    auctionId: string,
    filters: {
      category?: string;
      name?: string;
      page: number;
      limit: number;
      sort: string;
    }
  ) {
    const query: any = {};

    try {
      const auction = await this.auctionModel.findById(auctionId);
      if (!auction) {
        throw new NotFoundException(`Auction with id ${auctionId} not found`);
      }
    } catch (error) {
      if (error.name === "CastError") {
        throw new NotFoundException(`Auction with id ${auctionId} not found`);
      }
      throw error;
    }

    query.auction = auctionId;

    if (filters.category) {
      query.category = { $regex: filters.category, options: "i" };
    }

    if (filters.name) {
      query.name = { $regex: filters.name, $options: "i" };
    }

    return this.productModel
      .find(query)
      .select("-auction")
      .skip((filters.page - 1) * filters.limit)
      .limit(filters.limit)
      .sort(filters.sort);
  }

  async update(id: string, updateData: UpdateProductDto) {
    // Fetch the existing product
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException("Product not found");

    // Store the old auction before updating
    const oldAuctionId = product.auction.toString();

    Object.assign(product, updateData);

    await product.save();

    if (updateData.category || updateData.auction) {
      await this.updateAuctionCategorisAndNumber(product.auction.toString());
      if (updateData.auction && oldAuctionId != updateData.auction) {
        await this.updateAuctionCategorisAndNumber(oldAuctionId);
      }
    }

    await product.populate("auction");

    return product;
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) throw new NotFoundException("Product not found");

    await this.updateAuctionCategorisAndNumber(product.auction.toString());
    return "Product deleted successfully";
  }

  private async updateAuctionCategorisAndNumber(auctionId: string) {
    // Get all products associated with the auction
    const products = await this.productModel.find({
      auction: auctionId,
    });

    if (!products) {
      throw new NotFoundException(`Auction with id ${auctionId} not found`);
    }

    // Get unique categories from the products (ignoring falsy values)
    const uniqueCategories = [
      ...new Set(products.map((p) => p.category).filter(Boolean)),
    ];

    const auction = await this.auctionModel.findByIdAndUpdate(
      auctionId,
      {
        categories: uniqueCategories,
        productsNumber: products.length,
      },
      { new: true, runValidators: true }
    );
    if (!auction) {
      throw new NotFoundException(`Auction with id ${auctionId} not found`);
    }
  }
}
