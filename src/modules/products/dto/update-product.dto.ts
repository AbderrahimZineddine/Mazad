/* eslint-disable prettier/prettier */
// update-product.dto.ts
import { PartialType } from "@nestjs/mapped-types";
import { CreateProductDto } from "./create-product.dto";
import { ValidateIf } from "class-validator";

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ValidateIf((o) => Object.keys(o).length > 0)
  dummyField?: never;
}
