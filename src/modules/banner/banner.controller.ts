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
  create(@Body() createBannerDto: CreateBannerDto) {
    return this.bannerService.create(createBannerDto);
  }

  @Get()
  findAll(
    @Query("region") region: string,
    @Query("title") title: string,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 100,
    @Query("sort") sort: string = "-createdAt"
  ) {
    return this.bannerService.findAll({
      region,
      title,
      page,
      limit,
      sort,
    });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.bannerService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateBannerDto: UpdateBannerDto) {
    return this.bannerService.update(id, updateBannerDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.bannerService.remove(id);
  }
}
