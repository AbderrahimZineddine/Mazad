import { FilterQuery, Model, ProjectionType, QueryOptions, UpdateQuery, PopulateOptions, PipelineStage } from 'mongoose';
import { PaginationArg } from '../shared/args/pagination.arg';
import { PaginationHelper } from './pagination.helper';
import { HttpException } from '@nestjs/common';

type TPopulate = PopulateOptions | (string | PopulateOptions)[];

export class MongoRepository<T, CreateArg = unknown> {
  constructor(private readonly model: Model<T>) {

  }

  /**
   * Find documents with optional filters, projection, options, and populate.
   */
  async find(
    filter: FilterQuery<T> = {},
    projection?: ProjectionType<T>,
    options?: QueryOptions,
    populate?: TPopulate,
  ): Promise<T[]> {
    const query = this.model.find(filter, projection, options);

    if (populate) {
      query.populate(populate);
    }

    return query.exec();
  }

  /**
   * Find a single document with optional filters, projection, options, and populate.
   */
  async findOne(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions,
    populate?: TPopulate,
  ): Promise<T> {
    const query = this.model.findOne(filter, projection, options);

    if (populate) {
      query.populate(populate);
    }

    const doc = await query.exec();

    if (!doc) throw new HttpException(`${this.model.modelName} not found`, 404);

    return doc;
  }

  /**
   * Create a new document.
   */
  async create(doc: CreateArg) {
    const createdDoc = new this.model(doc);
    return createdDoc.save();
  }

  /**
   * Update a single document.
   */
  async updateOne(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: QueryOptions,
  ): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, update, { new: true, ...options }).exec();
  }

  /**
   * Delete a single document.
   */
  async deleteOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOneAndDelete(filter).exec();
  }

  /**
   * Aggregate queries.
   */
  async aggregate(pipeline: PipelineStage[]): Promise<any[]> {
    return this.model.aggregate(pipeline).exec();
  }

  /**
   * Count documents.
   */
  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  /**
   * Paginate using `aggregate` method.
   */
  async aggregateWithPagination(
    pipeline: PipelineStage[],
    paginationDto: PaginationArg,
  ) {
    return PaginationHelper.paginateWithAggregation(this.model, paginationDto, pipeline);
  }

  /**
   * Paginate using `find` method.
   */
  async findWithPagination(args: {
    filter: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
    populate?: TPopulate,
  },

    paginationDto: PaginationArg,
  ) {

    const { filter = {}, projection, options, populate } = args;

    return PaginationHelper.paginateWithFind<T>(this.model, paginationDto, filter, projection, options, populate);
  }


}
