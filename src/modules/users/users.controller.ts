/* eslint-disable prettier/prettier */
// src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  Param,
  Body,
  UseGuards,
  Req,
  BadRequestException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
// import { AuthGuard } from "../../guards/auth.guard";
// import { AdminGuard } from "../../guards/admin.guard";
import { RequestWithUser } from "../../types/request-with-user.type";
import { OwnerOrAdminGuard } from "src/guards/owner-or-admin.guard";
import { UpdateUserDto } from "./dtos/update-user.dto";

@Controller("users")
// @UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Get("me")
  // getCurrentUser(@Req() req: RequestWithUser) {
  //   return this.usersService.getCurrentUser(req.user.id);
  // }

  // @Get(":userId")
  // @UseGuards(OwnerOrAdminGuard)
  // getUser(@Param("userId") userId: string) {
  //   return this.usersService.getUser(userId);
  // }

  // @Get()
  // @UseGuards(AdminGuard)
  // getAllUsers(
  //   @Query("name") name?: string,
  //   @Query("wilaya") wilaya?: string,
  //   @Query("role") role?: string,
  //   @Query("page") page = 1,
  //   @Query("limit") limit = 100
  // ) {
  //   return this.usersService.getAllUsers({
  //     name,
  //     wilaya,
  //     role,
  //     page: Number(page),
  //     limit: Number(limit),
  //   });
  // }

  // @Patch(":userId")
  // @UseGuards(OwnerOrAdminGuard)
  // updateUser(
  //   @Param("userId") userId: string,
  //   @Body() updateUserDto: UpdateUserDto
  // ) {
  //   return this.usersService.updateUser(userId, updateUserDto);
  // }

  // @Delete(":userId")
  // @UseGuards(OwnerOrAdminGuard)
  // deleteUser(@Param("userId") userId: string) {
  //   return this.usersService.deleteUser(userId);
  // }

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
