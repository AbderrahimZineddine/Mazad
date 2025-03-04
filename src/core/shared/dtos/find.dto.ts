import { IsOptional, IsString } from "class-validator";

export class FindQuery {
    /**
     * The keyword to search for
     * @example 'Ahmed'
     */
    @IsOptional()
    @IsString()
    keyword?: string;

    /**
     * The fields to return
     * @example 'name email'
     */
    @IsOptional()
    @IsString()
    fields?: string;

    /**
     * The fields to sort by
     * @example 'name -email'
     */
    @IsOptional()
    @IsString()
    sort?: string;
}


