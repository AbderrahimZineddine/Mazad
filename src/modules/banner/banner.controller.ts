/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { BannerService } from "./banner.service";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { UpdateBannerDto } from "./dto/update-banner.dto";

@Controller("banners")
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
  async create(@Body() createBannerDto: CreateBannerDto) {
    const data = await this.bannerService.create(createBannerDto);

    return {
      success: true,
      statusCode: 201,
      data,
    };
  }

  @Get()
  async findAll(
    @Query("region") region: string,
    @Query("title") title: string,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 100,
    @Query("sort") sort: string = "-createdAt"
  ) {
    const data = await this.bannerService.findAll({
      region,
      title,
      page,
      limit,
      sort,
    });

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
    const data = await this.bannerService.findOne(id);

    return {
      success: true,
      statusCode: 200,
      data,
    };
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateBannerDto: UpdateBannerDto
  ) {
    const data = await this.bannerService.update(id, updateBannerDto);
    return {
      success: true,
      statusCode: 200,
      data,
    };
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    const message = await this.bannerService.remove(id);

    return {
      success: true,
      statusCode: 200,
      message,
    };
  }
}
