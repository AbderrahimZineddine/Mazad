/* eslint-disable prettier/prettier */
// user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Types } from 'mongoose';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return {
      ...request.user,
      _id: new Types.ObjectId(request.user.id), // Convert to ObjectId
    };
  },
);