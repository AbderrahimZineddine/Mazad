import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResult } from '../types/api-response';



@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((res: ApiResult<T>) => this.responseHandler(res, context)),
    );
  }



  responseHandler<T>(response: ApiResult<T>, context: ExecutionContext) {
    const res = context.switchToHttp().getResponse();
    const statusCode = res.statusCode;

    const { data, tokens, message, pagination } = response;

    return {
      sucess: true,
      statusCode,
      message,
      tokens,
      pagination,
      data,
    }
  }
}

