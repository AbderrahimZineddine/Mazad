/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  UsePipes,
  ParseIntPipe,
  ValidationPipe,
  DefaultValuePipe,
} from "@nestjs/common";
import { SalesService } from "./sales.service";
import { CreateSaleDto } from "./dto/create-sale.dto";
import { UpdateSaleDto } from "./dto/update-sale.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { AdminGuard } from "src/guards/admin.guard";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("sales")
@ApiBearerAuth()
@Controller("sales")
@UseGuards(AuthGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @UseGuards(AdminGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  findAll(
    @Query("location") location: string,
    @Query("beginDate") beginDate: Date,
    @Query("endDate") endDate: Date,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query("limit", new DefaultValuePipe(100), ParseIntPipe) limit: number = 100
  ) {
    return this.salesService.findAll({
      location,
      beginDate,
      endDate,
      page,
      limit,
    });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.salesService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(AdminGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param("id") id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(id, updateSaleDto);
  }

  @Delete(":id")
  @UseGuards(AdminGuard)
  remove(@Param("id") id: string) {
    return this.salesService.remove(id);
  }
}
