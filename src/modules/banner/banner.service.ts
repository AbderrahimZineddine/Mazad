/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { UpdateBannerDto } from "./dto/update-banner.dto";
import { Banner } from "./schamas/banner.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class BannerService {
  constructor(@InjectModel(Banner.name) private bannerModel: Model<Banner>) {}

  create(createBannerDto: CreateBannerDto) {
    const newbanner = new this.bannerModel(createBannerDto);
    return newbanner.save();
  }

  async findAll(filters: {
    region?: string;
    title?: string;
    page: number;
    limit: number;
    sort: string;
  }): Promise<Banner[]> {
    const query: any = {};

    if (filters.region) {
      query.region = { $regex: filters.region, options: "i" };
    }
    if (filters.title) {
      query.title = { $regex: filters.title, options: "i" };
    }

    return this.bannerModel
      .find(query)
      .skip((filters.page - 1) * filters.limit)
      .limit(filters.limit)
      .sort(filters.sort)
      .exec();
  }

  async findOne(id: string): Promise<Banner> {
    const banner = await this.bannerModel.findById(id).exec();
    if (!banner) throw new NotFoundException("Banner not found");
    return banner;
  }

  async update(id: string, updateBannerDto: UpdateBannerDto): Promise<Banner> {
    const banner = await this.bannerModel
      .findByIdAndUpdate(id, updateBannerDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!banner) throw new NotFoundException("Banner not found");
    return banner;
  }

  async remove(id: string): Promise<string> {
    const result = await this.bannerModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException("Banner not found");

    return "Banner deleted Successfully";
  }
}
