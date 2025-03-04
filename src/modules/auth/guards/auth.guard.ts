import { CanActivate, ExecutionContext, HttpException, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { isRoleAllowed, UserRoles } from 'src/core/enums/user-roles.enum';
import { JwtPayload } from 'src/core/types/jwt-payload';


const CHECK_VERIFIED_KEY = 'checkVerified'

export const Role = Reflector.createDecorator<UserRoles>();
export const UnCheckVerified = () => SetMetadata(CHECK_VERIFIED_KEY, true)
@Injectable()
export class HttpAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const request = context.switchToHttp().getRequest<Request>()

    const token = this.extractToken(request)

    try {
      const payload: JwtPayload = this.jwtService.verify(token)

      if (payload.isVerified !== true && !this.reflector.get<boolean>(CHECK_VERIFIED_KEY, context.getHandler())) {
        throw new HttpException('User is not verified', 600) // 600 is custom code for unverified user
      }


      this.checkRole(context, payload)


      request.user = payload;

    }
    catch (e) {
      const status = e.status || 401
      const message = e.message || 'Token verification failed'

      throw new HttpException(message, status, { cause: e })
    }



    return true;
  }


  private extractToken(request: Request): string {
    const authHeader = request.headers.authorization
    if (!authHeader) throw new HttpException('Authorization header not found', 401)

    const token = authHeader.split(' ')[1]
    if (!token) throw new HttpException('Token not found', 401)

    return token
  }

  private checkRole(context: ExecutionContext, payload: JwtPayload) {
    const allowedRole = this.reflector
      .getAllAndOverride(Role, [context.getHandler(), context.getClass()]);

    if (!isRoleAllowed(payload.role || UserRoles.USER, allowedRole)) {
      throw new HttpException('You are not allowed to access this resource', 401)
    }
  }
}

