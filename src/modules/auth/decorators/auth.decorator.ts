import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { Types } from "mongoose";

export const CurrentUser = createParamDecorator((data: any, context: ExecutionContext): Types.ObjectId => {
    const request = context.switchToHttp().getRequest<Request>();
    return request.user.id;
});
