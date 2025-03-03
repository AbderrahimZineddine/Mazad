/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product } from "./schemas/product.schema";
import { Auction } from "../auctions/schemas/auction.schema";
import { CreateProductDto } from "./dto/create-product.dto";

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Auction.name) private auctionModel: Model<Auction>
  ) {}

  async create(productData: CreateProductDto) {
    const auction = await this.auctionModel.findById(productData.auction);
    if (!auction) throw new NotFoundException("Auction not found");

    const newProduct = await this.productModel.create(productData);

    // auction.products.push(newProduct.id);
    await this.updateAuctionCategories(auction);

    return newProduct;
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id);
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
      if (error.name === 'CastError') {
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
      .skip((filters.page - 1) * filters.limit)
      .limit(filters.limit)
      .sort(filters.sort);
  }

  async update(id: string, updateData: Partial<Product>) {
    const product = await this.productModel.findByIdAndUpdate(
      id,
      updateData, // Use converted payload
      { new: true, runValidators: true }
    );

    if (!product) throw new NotFoundException("Product not found");

    if (updateData.category) {
      const auction = await this.auctionModel.findOne({ products: product.id });
      if (!auction) throw new NotFoundException("Product not in any auction");
      await this.updateAuctionCategories(auction);
    }

    return product;
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) throw new NotFoundException("Product not found");

    // Update auctions that contained this product
    await this.auctionModel.updateMany(
      { products: id },
      { $pull: { products: id } }
    );

    return { message: "Product deleted successfully" };
  }

  private async updateAuctionCategories(auction: any) {
    const products = await this.productModel.find({
      _id: { $in: auction.products },
    });
    const uniqueCategories = [
      ...new Set(products.map((p) => p.category).filter(Boolean)),
    ];
    auction.categories = uniqueCategories;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await auction.save();
  }
}
