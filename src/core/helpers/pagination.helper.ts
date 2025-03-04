import { FilterQuery, Model, PipelineStage, PopulateOptions, ProjectionType, QueryOptions } from 'mongoose';
import { PaginationArg } from '../shared/args/pagination.arg';


export abstract class PaginationHelper {
    /**
     * Pagination using the `find` method
     */
    static async paginateWithFind<T>(
        model: Model<T>,
        paginationDto: PaginationArg,
        filter: FilterQuery<T> = {},
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>,
        populate?: PopulateOptions | (string | PopulateOptions)[],
    ) {
        const { page = 1, limit = 10 } = paginationDto;
        const skip = (page - 1) * limit;

        const dataQuery = model.find(filter, projection, { ...options, skip, limit })
        if (populate) dataQuery.populate(populate);


        const [data, total] = await Promise.all([
            dataQuery.exec(),
            model.countDocuments(filter).exec(),
        ]);

        const currentPage = Math.min(page, Math.ceil(total / limit)) || 0;

        return {
            data,
            pagination: {
                page: currentPage,
                length: data.length,
                next: total > currentPage * limit ? currentPage + 1 : undefined,
                prev: currentPage > 1 ? currentPage - 1 : undefined
            },
        };
    }

    /**
     * Pagination using the `aggregate` method
     */
    static async paginateWithAggregation<T>(
        model: Model<T>,
        paginationDto: PaginationArg,
        pipeline: PipelineStage[] = [],
    ) {
        const { page = 1, limit = 10 } = paginationDto;
        const skip = (page - 1) * limit;

        const paginatedPipeline = [...pipeline];

        // Add pagination stages
        paginatedPipeline.push(
            { $skip: skip },
            { $limit: limit },
        );

        const [data, total] = await Promise.all([
            model.aggregate(paginatedPipeline).exec(),
            model.aggregate([...pipeline, { $count: 'total' }]).exec(),
        ]);

        const totalCount = total.length > 0 ? total[0].total : 0;

        const currentPage = Math.min(page, Math.ceil(totalCount / limit)) || 0;

        return {
            data,
            pagination: {
                page: currentPage,
                length: data.length,
                next: totalCount > currentPage * limit ? currentPage + 1 : undefined,
                prev: currentPage > 1 ? currentPage - 1 : undefined
            },
        };
    }
}
