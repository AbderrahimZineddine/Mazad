/* eslint-disable prettier/prettier */
// src/users/users.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.userModel.create(createUserDto);
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException("User already exists");
      }
      throw new BadRequestException("Failed to create user");
    }
  }

  async getCurrentUser(userId: string): Promise<User> {
    return this.getUser(userId);
  }

  async getUser(userId: string): Promise<User> {
    const user = await this.userModel
      .findById(userId)
      .select("-password -newPassword -newPasswordExpires");
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async getAllUsers(filters: {
    name?: string;
    wilaya?: string;
    role?: string;
    page: number;
    limit: number;
  }): Promise<User[]> {
    const query: any = {};

    if (filters.name) query.name = { $regex: filters.name, $options: "i" };
    if (filters.wilaya) query.wilaya = filters.wilaya;
    if (filters.role) query.role = filters.role;

    return this.userModel
      .find(query)
      .select("-password -newPassword -newPasswordExpires")
      .skip((filters.page - 1) * filters.limit)
      .limit(filters.limit)
      .sort("-createdAt");
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto
  ): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(userId, updateUserDto, {
        new: true,
        runValidators: true,
      })
      .select("-password -newPassword -newPasswordExpires");

    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.userModel.findByIdAndDelete(userId);
    if (!user) throw new NotFoundException("User not found");
  }

  async addUserPoints(userId: string, points: number): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(userId, { $inc: { points } }, { new: true })
      .select("-password -newPassword -newPasswordExpires");

    if (!user) throw new NotFoundException("User not found");
    return user;
  }
}
