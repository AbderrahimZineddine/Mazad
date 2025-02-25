/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { AuthGuard } from "src/guards/auth.guard";
import { AdminGuard } from "src/guards/admin.guard";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Controller("products")
@UseGuards(AuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AdminGuard)
  async createProduct(@Body() createProductDto: CreateProductDto) {
    const { auction, ...productData } = createProductDto;
    return this.productsService.create(productData, auction);
  }

  @Get()
  async getAllProducts(
    @Query("category") category: string,
    @Query("name") name: string,
    @Query("auction") auction: string,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 100
  ) {
    return this.productsService.findAll({
      category,
      name,
      auction,
      page,
      limit,
    });
  }

  @Get(":id")
  async getProduct(@Param("id") id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(AdminGuard)
  async updateProduct(
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(":id")
  @UseGuards(AdminGuard)
  async deleteProduct(@Param("id") id: string) {
    return this.productsService.remove(id);
  }
}
