/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sales } from './schemas/sales.schema';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

@Injectable()
export class SalesService {
  constructor(@InjectModel(Sales.name) private salesModel: Model<Sales>) {}

  async create(createSaleDto: CreateSaleDto): Promise<Sales> {
  
    const newSale = new this.salesModel(createSaleDto);
    return newSale.save();
  }

  async findAll(filters: { 
    region?: string;
    beginDate?: Date;
    endDate?: Date;
    page: number;
    limit: number;
  }): Promise<Sales[]> {
    const query: any = {};
    
    if (filters.region) query.region = filters.region;
    if (filters.beginDate || filters.endDate) {
      query.endDate = {};
      if (filters.beginDate) query.endDate.$gte = filters.beginDate;
      if (filters.endDate) query.endDate.$lte = filters.endDate;
    }

    return this.salesModel.find(query)
      .skip((filters.page - 1) * filters.limit)
      .limit(filters.limit)
      .sort('-createdAt')
      .exec();
  }

  async findOne(id: string): Promise<Sales> {
    const sale = await this.salesModel.findById(id).exec();
    if (!sale) throw new NotFoundException('Sale not found');
    return sale;
  }

  async update(id: string, updateSaleDto: UpdateSaleDto): Promise<Sales> {
    const sale = await this.salesModel.findByIdAndUpdate(id, updateSaleDto, {
      new: true,
      runValidators: true,
    }).exec();
    
    if (!sale) throw new NotFoundException('Sale not found');
    return sale;
  }

  async remove(id: string): Promise<void> {
    const result = await this.salesModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Sale not found');
  }
}