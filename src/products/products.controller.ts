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
  // UseGuards,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
// import { AuthGuard } from "src/guards/auth.guard";
// import { AdminGuard } from "src/guards/admin.guard";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Controller("products")
// @UseGuards(AuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  // @UseGuards(AdminGuard)
  async createProduct(@Body() createProductDto: CreateProductDto) {
    const data = await this.productsService.create(createProductDto);

    return {
      data,
    };
  }

  @Get(":auctionId")
  async getAllProducts(
    @Query("category") category: string,
    @Query("name") name: string,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 100,
    @Param("auctionId") auctionId: string
  ) {
    const data = await this.productsService.findAll(auctionId, {
      category,
      name,
      page,
      limit,
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
  async getProduct(@Param("id") id: string) {
    const data = await this.productsService.findOne(id);

    return {
      success: true,
      statusCode: 200,
      data,
    };
  }

  @Patch(":id")
  // @UseGuards(AdminGuard)
  async updateProduct(
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    const data = await this.productsService.update(id, updateProductDto);

    return {
      success: true,
      statusCode: 200,
      data,
    };
  }

  @Delete(":id")
  // @UseGuards(AdminGuard)
  async deleteProduct(@Param("id") id: string) {
    await this.productsService.remove(id);
    return {
      success: true,
      statusCode: 204,
      message: "Product deleted successfully",
    };
  }
}
