/* eslint-disable prettier/prettier */
// src/users/users.controller.ts
import {
  Controller,
  Get,
  // Post,
  // Patch,
  // Delete,
  Query,
  Param,
  Patch,
  Body,
  Delete,
  Req,
  UseGuards,
  // Body,
  // UseGuards,
  // Req,
  // BadRequestException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { Request } from "express";
import { HttpAuthGuard } from "../auth/guards/auth.guard";
// import { AuthGuard } from "../../guards/auth.guard";
// import { AdminGuard } from "../../guards/admin.guard";
// import { RequestWithUser } from "../../types/request-with-user.type";
// import { OwnerOrAdminGuard } from "src/guards/owner-or-admin.guard";
// import { UpdateUserDto } from "./dtos/update-user.dto";

@Controller("users")
@UseGuards(HttpAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  getCurrentUser(@Req() req: Request) {
    return this.usersService.getCurrentUser(req.user.id.toString());
  }

  @Get(":userId")
  // @UseGuards(OwnerOrAdminGuard)
  async getUser(@Param("userId") userId: string) {
    const data = await this.usersService.getUser(userId);

    return {
      success: true,
      statusCode: 200,
      data,
    };
  }

  @Get()
  // @UseGuards(AdminGuard)
  async getAllUsers(
    @Query("name") name?: string,
    @Query("region") region?: string,
    @Query("role") role?: string,
    @Query("page") page = 1,
    @Query("limit") limit = 100
  ) {
    const data = await this.usersService.getAllUsers({
      name,
      region,
      role,
      page: Number(page),
      limit: Number(limit),
    });

    return {
      success: true,
      statusCode: 200,
      limit,
      page,
      data,
    };
  }

  @Patch(":userId")
  // @UseGuards(OwnerOrAdminGuard)
  async updateUser(
    @Param("userId") userId: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const data = await this.usersService.updateUser(userId, updateUserDto);

    return {
      success: true,
      statusCode: 200,
      data,
    };
  }

  @Delete(":userId")
  // @UseGuards(OwnerOrAdminGuard)
  async deleteUser(@Param("userId") userId: string) {
    const message = await this.usersService.deleteUser(userId);
    return {
      success: true,
      statusCode: 204,
      message,
    };
  }

  // @Post(":userId/add-points")
  // @UseGuards(AdminGuard)
  // addUserPoints(
  //   @Param("userId") userId: string,
  //   @Body("points") points: number
  // ) {
  //   if (!points || points < 0) {
  //     throw new BadRequestException("Points must be a positive number");
  //   }
  //   return this.usersService.addUserPoints(userId, points);
  // }
}
