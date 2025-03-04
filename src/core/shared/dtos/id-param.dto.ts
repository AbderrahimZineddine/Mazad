import { IsMongoId } from "class-validator";
import { Types } from "mongoose";

export class IdParams {
    /**
     * ID of the entity
     * @example 1
     */
    @IsMongoId()
    id: Types.ObjectId;
}